'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ScoreGauge, KYCBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  LayoutDashboard, Search, MessageSquare, Briefcase, Settings, LogOut,
  TrendingUp, Filter, Building2, MapPin, ArrowRight, Crown, ChevronDown,
} from 'lucide-react';

interface PitchInMatch {
  _id: string;
  businessName: string;
  industry: string;
  description: string;
  fundingAsk: number;
  fundingType: string;
  location: string;
  legitimacyScore: number;
  status: string;
  viewCount: number;
}

interface MatchData {
  _id: string;
  pitchId: PitchInMatch;
  compatibilityScore: number;
  matchBreakdown: { industryFit: number; ticketFit: number; riskFit: number; locationFit: number; semanticFit: number };
  status: string;
  createdAt: string;
}

const INDUSTRY_LABELS: Record<string, string> = {
  'e-commerce': 'E-Commerce',
  'light-manufacturing': 'Light Manufacturing',
  'agro-processing-agritech': 'Agro / AgriTech',
  'tech-enabled-services': 'Tech Services',
  'other': 'Other',
};

export default function InvestorDashboard() {
  const { user, logout } = useAuth();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [filterOpen, setFilterOpen] = useState(false);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'newest' | 'ask'>('score');
  const [selectedPitch, setSelectedPitch] = useState<PitchInMatch | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        if (data.success) setMatches(data.data);
      } catch (e) {
        console.error('Fetch error:', e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMatches = matches
    .filter((m) => {
      if (!m.pitchId) return false;
      if (industryFilter !== 'all' && m.pitchId.industry !== industryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.compatibilityScore - a.compatibilityScore;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'ask') return (b.pitchId?.fundingAsk || 0) - (a.pitchId?.fundingAsk || 0);
      return 0;
    });

  const sidebarItems = [
    { key: 'feed', label: 'Pitch Feed', icon: Search },
    { key: 'dealrooms', label: 'Deal Rooms', icon: MessageSquare },
    { key: 'portfolio', label: 'Portfolio', icon: Briefcase, premium: true },
    { key: 'settings', label: 'Preferences', icon: Settings },
  ];

  const handleOpenDealRoom = async (matchId: string) => {
    try {
      const res = await fetch('/api/deal-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveTab('dealrooms');
      } else {
        alert(data.error || 'Failed to open deal room');
      }
    } catch {
      alert('Network error');
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-navy-900/50 flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              N
            </div>
            <span className="text-lg font-bold text-white">
              Nex<span className="text-accent-400">Fund</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.key
                  ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.premium && (
                <Crown size={14} className="ml-auto text-warning-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'feed' ? 'AI-Ranked Pitch Feed' :
                 activeTab === 'dealrooms' ? 'Deal Rooms' :
                 activeTab === 'portfolio' ? 'Portfolio Tracking' : 'Investment Preferences'}
              </h1>
              <p className="text-sm text-gray-400">
                {matches.length} matched pitches • Investor Dashboard
              </p>
            </div>
          </div>

          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-6 animate-fade-in">
              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-800 border border-navy-600 rounded-xl text-sm text-gray-300 hover:border-navy-500 transition-all"
                >
                  <Filter size={16} />
                  Filter
                  <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="px-3 py-2 bg-navy-800 border border-navy-600 rounded-xl text-sm text-white appearance-none"
                >
                  <option value="all">All Industries</option>
                  {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'newest' | 'ask')}
                  className="px-3 py-2 bg-navy-800 border border-navy-600 rounded-xl text-sm text-white appearance-none"
                >
                  <option value="score">Best Match</option>
                  <option value="newest">Newest</option>
                  <option value="ask">Highest Ask</option>
                </select>

                <span className="text-xs text-gray-500 ml-auto">
                  {filteredMatches.length} result{filteredMatches.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Pitch Cards */}
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 skeleton" />
                  ))}
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Search size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No matches found. Try adjusting your preferences.</p>
                  <Link href="/investor/onboarding" className="mt-4 inline-block">
                    <Button variant="outline" size="sm">Update Preferences</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 stagger-children">
                  {filteredMatches.map((match) => {
                    const p = match.pitchId;
                    if (!p) return null;
                    return (
                      <div
                        key={match._id}
                        className="glass-card p-6 hover:border-accent-500/20 transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedPitch(selectedPitch?._id === p._id ? null : p)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Score Badge */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xl font-bold text-accent-400">
                                {match.compatibilityScore}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold text-white truncate">{p.businessName}</h3>
                                <KYCBadge
                                  status={p.legitimacyScore >= 60 ? 'verified' : 'pending'}
                                  size="sm"
                                />
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                <span className="flex items-center gap-1">
                                  <Building2 size={12} />
                                  {INDUSTRY_LABELS[p.industry] || p.industry}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {p.location}
                                </span>
                                <span className="capitalize">{p.fundingType}</span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {p.description.substring(0, 150)}...
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                ৳{p.fundingAsk.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                ≈ ${(p.fundingAsk / 110).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </p>
                            </div>
                            <ScoreGauge score={p.legitimacyScore} size={48} />
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        {selectedPitch?._id === p._id && (
                          <div className="mt-5 pt-5 border-t border-white/5 animate-fade-in">
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Industry Fit</p>
                                <div className="h-1.5 bg-navy-700 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-accent-500 rounded-full" style={{ width: `${(match.matchBreakdown.industryFit / 30) * 100}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{match.matchBreakdown.industryFit}/30</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Ticket Fit</p>
                                <div className="h-1.5 bg-navy-700 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(match.matchBreakdown.ticketFit / 25) * 100}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{match.matchBreakdown.ticketFit}/25</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Risk Fit</p>
                                <div className="h-1.5 bg-navy-700 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(match.matchBreakdown.riskFit / 20) * 100}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{match.matchBreakdown.riskFit}/20</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Location Fit</p>
                                <div className="h-1.5 bg-navy-700 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-warning-400 rounded-full" style={{ width: `${(match.matchBreakdown.locationFit / 10) * 100}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{match.matchBreakdown.locationFit}/10</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleOpenDealRoom(match._id); }}>
                                Open Deal Room <ArrowRight size={14} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                Pass
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Deal Rooms Tab */}
          {activeTab === 'dealrooms' && (
            <DealRoomsPanel />
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="animate-fade-in glass-card p-12 text-center">
              <Crown size={48} className="text-warning-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Subscriber Feature</h3>
              <p className="text-gray-400 mb-6">Track your invested SMEs and get update notifications.</p>
              <Link href="/pricing">
                <Button>Subscribe for ৳1,500/mo</Button>
              </Link>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in glass-card p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Investment Preferences</h3>
              <p className="text-sm text-gray-400 mb-6">Update your preferences to get better matches.</p>
              <Link href="/investor/onboarding">
                <Button variant="outline">
                  <Settings size={16} /> Edit Preferences
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DealRoomsPanel() {
  const [rooms, setRooms] = useState<Array<{
    _id: string;
    dealStatus: string;
    matchId: { pitchId: { businessName: string; industry: string } };
    participants: Array<{ name: string; role: string }>;
    messages: Array<{ content: string; timestamp: string }>;
    updatedAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/deal-rooms');
        const data = await res.json();
        if (data.success) setRooms(data.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchRooms();
  }, []);

  if (loading) return <div className="h-40 skeleton" />;

  if (rooms.length === 0) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No deal rooms yet. Open a deal room from a matched pitch to start a conversation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {rooms.map((room) => (
        <Link key={room._id} href={`/investor/deal-room/${room._id}`}>
          <div className="glass-card-light p-5 flex items-center justify-between hover:border-accent-500/20 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} className="text-accent-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {room.matchId?.pitchId?.businessName || 'Unknown Business'}
                </p>
                <p className="text-xs text-gray-400">
                  {room.messages.length} messages • {room.dealStatus}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              room.dealStatus === 'open' ? 'bg-accent-500/10 text-accent-400' :
              room.dealStatus === 'negotiating' ? 'bg-warning-400/10 text-warning-400' :
              room.dealStatus === 'closed_won' ? 'bg-green-500/10 text-green-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {room.dealStatus.replace('_', ' ')}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
