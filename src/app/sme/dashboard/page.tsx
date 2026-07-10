'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ScoreGauge, KYCBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  LayoutDashboard, FileText, Users, MessageSquare, BarChart3, LogOut,
  TrendingUp, Plus, Crown, ArrowRight, Eye
} from 'lucide-react';

interface PitchData {
  _id: string;
  businessName: string;
  industry: string;
  status: string;
  legitimacyScore: number;
  legitimacyFlags: string[];
  fundingAsk: number;
  fundingType: string;
  viewCount: number;
  createdAt: string;
}

interface MatchData {
  _id: string;
  compatibilityScore: number;
  matchBreakdown: { industryFit: number; ticketFit: number; riskFit: number; locationFit: number } | null;
  status: string;
  investorId: { name: string; email: string };
}

export default function SMEDashboard() {
  const { user, logout } = useAuth();
  const [pitches, setPitches] = useState<PitchData[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const [pitchRes, matchRes] = await Promise.all([
          fetch('/api/pitches'),
          fetch('/api/matches'),
        ]);
        const pitchData = await pitchRes.json();
        const matchData = await matchRes.json();
        if (pitchData.success) setPitches(pitchData.data);
        if (matchData.success) setMatches(matchData.data);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const pitch = pitches[0]; // Primary pitch for free tier

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'pitch', label: 'My Pitch', icon: FileText },
    { key: 'matches', label: 'Matches', icon: Users },
    { key: 'dealrooms', label: 'Deal Rooms', icon: MessageSquare },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, premium: true },
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
              {item.premium && user?.tier !== 'premium' && (
                <Crown size={14} className="ml-auto text-warning-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          {user?.tier === 'free' && (
            <Link href="/pricing" className="block mb-3">
              <div className="p-3 bg-gradient-to-r from-accent-500/10 to-accent-600/5 border border-accent-500/20 rounded-xl text-center">
                <Crown size={16} className="text-warning-400 mx-auto mb-1" />
                <p className="text-xs text-accent-400 font-medium">Upgrade to Premium</p>
                <p className="text-xs text-gray-500">৳2,500/month</p>
              </div>
            </Link>
          )}
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
                Welcome, {user?.name || 'Founder'} 👋
              </h1>
              <p className="text-sm text-gray-400">
                {user?.tier === 'premium' ? 'Premium' : 'Free'} Plan • SME Dashboard
              </p>
            </div>
            {!pitch && (
              <Link href="/sme/onboarding">
                <Button><Plus size={16} /> Create Your Pitch</Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 skeleton" />
              ))}
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                    <div className="stat-card">
                      <p className="text-xs text-gray-400 mb-1">Pitch Status</p>
                      <div className="mt-2">
                        {pitch ? (
                          <KYCBadge status={pitch.status === 'active' ? 'verified' : pitch.status === 'flagged' ? 'flagged' : 'pending'} />
                        ) : (
                          <span className="text-gray-500 text-sm">No pitch yet</span>
                        )}
                      </div>
                    </div>
                    <div className="stat-card">
                      <p className="text-xs text-gray-400 mb-1">Legitimacy Score</p>
                      {pitch ? (
                        <ScoreGauge score={pitch.legitimacyScore} size={64} />
                      ) : (
                        <span className="text-2xl font-bold text-gray-600">—</span>
                      )}
                    </div>
                    <div className="stat-card">
                      <p className="text-xs text-gray-400 mb-1">Matches This Month</p>
                      <p className="text-3xl font-bold text-white">{matches.length}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        of {user?.tier === 'premium' ? '25' : '5'} allowed
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="text-xs text-gray-400 mb-1">Pitch Views</p>
                      <div className="flex items-center gap-2">
                        <Eye size={18} className="text-accent-400" />
                        <p className="text-3xl font-bold text-white">{pitch?.viewCount || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Matches */}
                  {matches.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-4">Recent Matches</h2>
                      <div className="space-y-3">
                        {matches.slice(0, 3).map((m) => (
                          <div key={m._id} className="glass-card-light p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center">
                                <TrendingUp size={18} className="text-accent-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {m.investorId?.name || 'Anonymous Investor'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Compatibility: {m.compatibilityScore}%
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View <ArrowRight size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flags / Warnings */}
                  {pitch?.legitimacyFlags && pitch.legitimacyFlags.length > 0 && (
                    <div className="glass-card p-6 border-warning-400/30">
                      <h3 className="text-sm font-semibold text-warning-400 mb-3">⚠ Legitimacy Flags</h3>
                      <ul className="space-y-2">
                        {pitch.legitimacyFlags.map((flag, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning-400 mt-1.5 flex-shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === 'matches' && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Your Investor Matches ({matches.length})
                  </h2>
                  {matches.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                      <Users size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No matches yet. Make sure your pitch is active.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((m, i) => (
                        <div key={m._id} className="glass-card-light p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-lg font-bold text-accent-400">
                              {m.compatibilityScore}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {m.investorId?.name || `Investor #${i + 1}`}
                              </p>
                              {m.matchBreakdown ? (
                                <div className="flex gap-3 mt-1">
                                  <span className="text-xs text-gray-500">Industry: {m.matchBreakdown.industryFit}</span>
                                  <span className="text-xs text-gray-500">Ticket: {m.matchBreakdown.ticketFit}</span>
                                  <span className="text-xs text-gray-500">Risk: {m.matchBreakdown.riskFit}</span>
                                </div>
                              ) : (
                                <p className="text-xs text-warning-400 flex items-center gap-1">
                                  <Crown size={12} /> Upgrade to see full breakdown
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Open Deal Room</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pitch Tab */}
              {activeTab === 'pitch' && (
                <div className="animate-fade-in">
                  {pitch ? (
                    <div className="glass-card p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-white">{pitch.businessName}</h2>
                          <p className="text-sm text-gray-400 capitalize">{pitch.industry.replace(/-/g, ' ')} • {pitch.fundingType}</p>
                        </div>
                        <KYCBadge status={pitch.status === 'active' ? 'verified' : pitch.status === 'flagged' ? 'flagged' : 'pending'} />
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-xs text-gray-400">Funding Ask</p>
                          <p className="text-lg font-bold text-white">৳{pitch.fundingAsk.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Legitimacy Score</p>
                          <ScoreGauge score={pitch.legitimacyScore} size={56} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center">
                      <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">You haven&apos;t created a pitch yet</p>
                      <Link href="/sme/onboarding">
                        <Button><Plus size={16} /> Create Your Pitch</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Deal Rooms Tab */}
              {activeTab === 'dealrooms' && (
                <div className="animate-fade-in glass-card p-12 text-center">
                  <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Deal rooms appear here when you connect with an investor.</p>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="animate-fade-in">
                  {user?.tier === 'premium' ? (
                    <div className="glass-card p-12 text-center">
                      <BarChart3 size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Analytics will populate as you get more investor engagement.</p>
                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center">
                      <Crown size={48} className="text-warning-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
                      <p className="text-gray-400 mb-6">Analytics dashboard is available on the Premium plan.</p>
                      <Link href="/pricing">
                        <Button>Upgrade for ৳2,500/mo</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
