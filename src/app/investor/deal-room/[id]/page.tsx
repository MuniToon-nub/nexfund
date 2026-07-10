'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import {
  ArrowLeft, Send, Paperclip, Building2, TrendingUp,
  CheckCircle, Clock, AlertTriangle,
} from 'lucide-react';

interface Message {
  _id: string;
  sender: string;
  content: string;
  attachmentUrl?: string;
  timestamp: string;
}

interface DealRoomData {
  _id: string;
  dealStatus: string;
  dealValue?: number;
  commissionRate: number;
  participants: Array<{ _id: string; name: string; email: string; role: string }>;
  messages: Message[];
  matchId: {
    pitchId: {
      businessName: string;
      industry: string;
      fundingAsk: number;
    };
    compatibilityScore: number;
  };
}

export default function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [room, setRoom] = useState<DealRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRoom();
    // Poll for new messages every 10s
    const interval = setInterval(fetchRoom, 10000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room?.messages]);

  async function fetchRoom() {
    try {
      const res = await fetch(`/api/deal-rooms/${id}`);
      const data = await res.json();
      if (data.success) setRoom(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/deal-rooms/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('');
        fetchRoom();
      }
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  }

  async function updateStatus(status: string, dealValue?: number) {
    try {
      await fetch(`/api/deal-rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealStatus: status, dealValue }),
      });
      fetchRoom();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Deal room not found</p>
          <Link href={user?.role === 'sme' ? '/sme/dashboard' : '/investor/dashboard'}>
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = room.participants.find((p) => p._id !== user?.id);
  const pitch = room.matchId?.pitchId;

  const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    open: { color: 'text-accent-400', icon: Clock, label: 'Open' },
    negotiating: { color: 'text-warning-400', icon: AlertTriangle, label: 'Negotiating' },
    closed_won: { color: 'text-green-400', icon: CheckCircle, label: 'Closed — Won' },
    closed_lost: { color: 'text-gray-400', icon: AlertTriangle, label: 'Closed — Lost' },
  };

  const statusInfo = statusConfig[room.dealStatus] || statusConfig.open;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col h-screen bg-navy-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href={user?.role === 'sme' ? '/sme/dashboard' : '/investor/dashboard'}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center">
              {otherParticipant?.role === 'investor' ? (
                <TrendingUp size={18} className="text-accent-400" />
              ) : (
                <Building2 size={18} className="text-accent-400" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                {pitch?.businessName || 'Deal Room'}
              </h1>
              <p className="text-xs text-gray-400">
                with {otherParticipant?.name || 'Unknown'} •{' '}
                {pitch ? `৳${pitch.fundingAsk.toLocaleString()}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 text-xs font-medium ${statusInfo.color}`}>
            <StatusIcon size={14} />
            {statusInfo.label}
          </div>

          {/* Status Actions */}
          {room.dealStatus !== 'closed_won' && room.dealStatus !== 'closed_lost' && (
            <div className="flex gap-2">
              {room.dealStatus === 'open' && (
                <Button size="sm" variant="outline" onClick={() => updateStatus('negotiating')}>
                  Start Negotiating
                </Button>
              )}
              {room.dealStatus === 'negotiating' && (
                <>
                  <Button size="sm" onClick={() => {
                    const val = prompt('Enter deal value (BDT):');
                    if (val) updateStatus('closed_won', parseInt(val));
                  }}>
                    Close — Won
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus('closed_lost')}>
                    Close — Lost
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {room.messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}

        {room.messages.map((msg) => {
          const isMe = msg.sender === user?.id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${
                isMe
                  ? 'bg-accent-500/20 border border-accent-500/30 rounded-2xl rounded-br-md'
                  : 'bg-navy-800 border border-navy-600 rounded-2xl rounded-bl-md'
              } px-4 py-3`}>
                <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                {msg.attachmentUrl && (
                  <a
                    href={msg.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300"
                  >
                    <Paperclip size={12} /> Attachment
                  </a>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {(room.dealStatus === 'open' || room.dealStatus === 'negotiating') && (
        <form
          onSubmit={handleSend}
          className="border-t border-white/5 bg-navy-900/50 backdrop-blur-xl px-6 py-4"
        >
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <button
              type="button"
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-navy-800 transition-colors"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 px-4 py-2.5 text-sm"
            />
            <Button type="submit" loading={sending} disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </form>
      )}

      {/* Deal Closed Banner */}
      {(room.dealStatus === 'closed_won' || room.dealStatus === 'closed_lost') && (
        <div className={`px-6 py-4 text-center text-sm font-medium ${
          room.dealStatus === 'closed_won'
            ? 'bg-green-500/10 text-green-400 border-t border-green-500/20'
            : 'bg-gray-500/10 text-gray-400 border-t border-gray-500/20'
        }`}>
          {room.dealStatus === 'closed_won'
            ? `🎉 Deal closed! Value: ৳${room.dealValue?.toLocaleString() || '—'} • Commission: ৳${(room.dealValue ? Math.round(room.dealValue * room.commissionRate) : 0).toLocaleString()}`
            : 'This deal room has been closed.'}
        </div>
      )}
    </div>
  );
}
