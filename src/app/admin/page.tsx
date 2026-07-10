'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import { KYCBadge } from '@/components/ui/Badge';
import {
  LayoutDashboard, ShieldCheck, Users, Handshake, LogOut,
  TrendingUp, CheckCircle, XCircle, AlertTriangle, Eye, Ban,
} from 'lucide-react';

interface MetricsData {
  totalSMEs: number;
  totalInvestors: number;
  totalPitches: number;
  activePitches: number;
  totalMatches: number;
  openDealRooms: number;
  closedDeals: number;
  activeSubscriptions: number;
  mrr: number;
  totalCommission: number;
}

interface KYCPitch {
  _id: string;
  businessName: string;
  industry: string;
  status: string;
  legitimacyScore: number;
  legitimacyFlags: string[];
  documents: {
    tradeLicenseUrl?: string;
    tinCertificateUrl?: string;
    pitchDeckUrl?: string;
  };
  ownerId: { name: string; email: string; phone: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [kycQueue, setKycQueue] = useState<KYCPitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [metricsRes, kycRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/kyc'),
      ]);
      const metricsData = await metricsRes.json();
      const kycData = await kycRes.json();
      if (metricsData.success) setMetrics(metricsData.data);
      if (kycData.success) setKycQueue(kycData.data);
    } catch (e) {
      console.error('Admin fetch error:', e);
    }
    setLoading(false);
  }

  async function handleKYCAction(pitchId: string, action: 'approve' | 'flag' | 'reject', reason?: string) {
    try {
      const res = await fetch('/api/admin/kyc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitchId, action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setKycQueue((prev) => prev.filter((p) => p._id !== pitchId));
        fetchData();
      } else {
        alert(data.error);
      }
    } catch {
      alert('Network error');
    }
  }

  async function handleRecompute() {
    try {
      const res = await fetch('/api/matches/recompute', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch {
      alert('Failed to recompute');
    }
  }

  const sidebarItems = [
    { key: 'metrics', label: 'Overview', icon: LayoutDashboard },
    { key: 'kyc', label: 'KYC Queue', icon: ShieldCheck, badge: kycQueue.length },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'deals', label: 'Deals', icon: Handshake },
  ];

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
              <span className="text-xs text-gray-500 ml-1">Admin</span>
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
              {item.badge ? (
                <span className="ml-auto text-xs bg-danger-500 text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={handleRecompute}>
            Recompute Matches
          </Button>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Platform management & oversight</p>
          </div>

          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-fade-in">
              {loading || !metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 skeleton" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
                    {[
                      { label: 'Total SMEs', value: metrics.totalSMEs, icon: '🏢' },
                      { label: 'Total Investors', value: metrics.totalInvestors, icon: '💼' },
                      { label: 'Active Pitches', value: metrics.activePitches, icon: '📄' },
                      { label: 'Total Matches', value: metrics.totalMatches, icon: '🤝' },
                      { label: 'Open Deal Rooms', value: metrics.openDealRooms, icon: '💬' },
                      { label: 'Deals Closed', value: metrics.closedDeals, icon: '✅' },
                      { label: 'MRR', value: `৳${metrics.mrr.toLocaleString()}`, icon: '📈' },
                      { label: 'Commission Earned', value: `৳${metrics.totalCommission.toLocaleString()}`, icon: '💰' },
                    ].map((stat, i) => (
                      <div key={i} className="stat-card">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{stat.icon}</span>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Conversion Funnel</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Signups', value: metrics.totalSMEs + metrics.totalInvestors, pct: 100 },
                        { label: 'Active Pitches', value: metrics.activePitches, pct: metrics.totalSMEs > 0 ? Math.round((metrics.activePitches / metrics.totalSMEs) * 100) : 0 },
                        { label: 'Matches Created', value: metrics.totalMatches, pct: metrics.activePitches > 0 ? Math.min(100, Math.round((metrics.totalMatches / metrics.activePitches) * 100)) : 0 },
                        { label: 'Deal Rooms Opened', value: metrics.openDealRooms, pct: metrics.totalMatches > 0 ? Math.round((metrics.openDealRooms / metrics.totalMatches) * 100) : 0 },
                        { label: 'Deals Closed', value: metrics.closedDeals, pct: metrics.openDealRooms > 0 ? Math.round((metrics.closedDeals / metrics.openDealRooms) * 100) : 0 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-xs text-gray-400 w-36">{item.label}</span>
                          <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-white font-medium w-12 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* KYC Queue Tab */}
          {activeTab === 'kyc' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-4">
                KYC Review Queue ({kycQueue.length})
              </h2>
              {kycQueue.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <ShieldCheck size={48} className="text-accent-500 mx-auto mb-4" />
                  <p className="text-gray-400">All clear! No pitches pending review.</p>
                </div>
              ) : (
                kycQueue.map((pitch) => (
                  <div key={pitch._id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-white">{pitch.businessName}</h3>
                        <p className="text-xs text-gray-400">
                          {pitch.ownerId?.name} • {pitch.ownerId?.email} • {pitch.ownerId?.phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Industry: {pitch.industry} • Submitted: {new Date(pitch.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <KYCBadge status={pitch.status === 'flagged' ? 'flagged' : 'pending'} />
                    </div>

                    {/* Documents */}
                    <div className="flex gap-3 mb-4">
                      {pitch.documents?.tradeLicenseUrl ? (
                        <a href={pitch.documents.tradeLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
                          <Eye size={12} /> Trade License
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Ban size={12} /> No trade license</span>
                      )}
                      {pitch.documents?.tinCertificateUrl ? (
                        <a href={pitch.documents.tinCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
                          <Eye size={12} /> TIN Certificate
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Ban size={12} /> No TIN</span>
                      )}
                    </div>

                    {/* Flags */}
                    {pitch.legitimacyFlags.length > 0 && (
                      <div className="mb-4 p-3 bg-warning-400/5 border border-warning-400/20 rounded-xl">
                        <p className="text-xs font-medium text-warning-400 mb-1">Auto-detected flags:</p>
                        <ul className="space-y-1">
                          {pitch.legitimacyFlags.map((f, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-center gap-1">
                              <AlertTriangle size={10} className="text-warning-400" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Score + Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-sm">
                        <span className="text-gray-400">Legitimacy Score: </span>
                        <span className={`font-bold ${
                          pitch.legitimacyScore >= 60 ? 'text-accent-400' :
                          pitch.legitimacyScore >= 40 ? 'text-warning-400' : 'text-danger-400'
                        }`}>
                          {pitch.legitimacyScore}/100
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleKYCAction(pitch._id, 'approve')}>
                          <CheckCircle size={14} /> Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          const reason = prompt('Enter flag reason:');
                          if (reason) handleKYCAction(pitch._id, 'flag', reason);
                        }}>
                          <AlertTriangle size={14} /> Flag
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) handleKYCAction(pitch._id, 'reject', reason);
                        }}>
                          <XCircle size={14} /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="animate-fade-in glass-card p-12 text-center">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">User management panel. View and manage all platform users.</p>
              <p className="text-xs text-gray-500 mt-2">Coming soon — user list with suspend/unsuspend controls.</p>
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div className="animate-fade-in glass-card p-12 text-center">
              <Handshake size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Deal oversight panel. View closed deals and record commissions.</p>
              <p className="text-xs text-gray-500 mt-2">Coming soon — deal value recording and commission tracking.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
