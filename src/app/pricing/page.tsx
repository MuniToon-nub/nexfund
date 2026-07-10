'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthProvider';
import { CheckCircle, X, Crown, ArrowRight, Zap } from 'lucide-react';

type PlanKey = 'sme-free' | 'sme-premium' | 'investor';

interface Feature {
  name: string;
  free: string | boolean;
  smePremium: string | boolean;
  investor: string | boolean;
}

const FEATURES: Feature[] = [
  { name: 'Active Pitches', free: '1', smePremium: 'Unlimited', investor: '—' },
  { name: 'AI Matches / Month', free: '5', smePremium: '25', investor: 'Unlimited feed' },
  { name: 'Match Score Breakdown', free: 'Basic', smePremium: 'Full', investor: 'Full' },
  { name: 'Concurrent Deal Rooms', free: '1', smePremium: '5', investor: 'Unlimited' },
  { name: 'File Sharing in Deal Room', free: false, smePremium: true, investor: true },
  { name: 'AI Pitch Suggestions', free: false, smePremium: true, investor: '—' },
  { name: 'Analytics Dashboard', free: false, smePremium: true, investor: '—' },
  { name: 'Priority Feed Placement', free: false, smePremium: true, investor: '—' },
  { name: 'Saved Filters', free: '—', smePremium: '—', investor: true },
  { name: 'Early Access to Pitches', free: '—', smePremium: '—', investor: true },
  { name: 'Portfolio Tracking', free: '—', smePremium: '—', investor: true },
  { name: 'KYC Verified Badge', free: true, smePremium: true, investor: '—' },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [billing] = useState<'monthly'>('monthly');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (plan: PlanKey) => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    if (plan === 'sme-free') return;

    setSubscribing(true);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'bkash' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ' + data.data.message);
        window.location.reload();
      } else {
        alert('❌ ' + (data.error || 'Subscription failed'));
      }
    } catch {
      alert('Network error');
    }
    setSubscribing(false);
  };

  const renderCell = (val: string | boolean) => {
    if (val === true) return <CheckCircle size={18} className="text-accent-500 mx-auto" />;
    if (val === false) return <X size={18} className="text-gray-600 mx-auto" />;
    return <span className="text-sm text-gray-300">{val}</span>;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-xs font-medium mb-4">
              <Zap size={14} />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Plans that grow with you
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Start free as an SME founder. Upgrade when you need more matches,
              deal rooms, and AI-powered insights.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {/* SME Free */}
            <div className="glass-card p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">SME Free</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">৳0</span>
                  <span className="text-sm text-gray-500">forever</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">For founders just getting started</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['1 active pitch', '5 AI matches/month', '1 deal room', 'KYC verified badge', 'Basic match score'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-accent-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* SME Premium */}
            <div className="glass-card p-8 flex flex-col border-accent-500/40 relative shadow-lg shadow-accent-500/5">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Crown size={12} /> MOST POPULAR
              </div>
              <div className="mb-6">
                <p className="text-sm text-accent-400 mb-1">SME Premium</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">৳2,500</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">≈ $23/mo • For serious fundraisers</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited pitches',
                  '25 AI matches/month',
                  '5 concurrent deal rooms',
                  'Full score breakdown',
                  'AI pitch suggestions',
                  'Analytics dashboard',
                  'Priority feed placement',
                  'File sharing in deal rooms',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-accent-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg" loading={subscribing} onClick={() => handleSubscribe('sme-premium')}>
                Upgrade Now <ArrowRight size={16} />
              </Button>
            </div>

            {/* Investor */}
            <div className="glass-card p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Investor Subscription</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">৳1,500</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">≈ $14/mo • For active investors</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited ranked pitch feed',
                  'Saved search filters',
                  'Unlimited deal rooms',
                  'Early access to new pitches',
                  'Portfolio tracking',
                  'Full score breakdown',
                  'Update notifications',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-accent-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" size="lg" loading={subscribing} onClick={() => handleSubscribe('investor')}>
                Subscribe <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Feature</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">SME Free</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-accent-400">SME Premium</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">Investor</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feature, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5 text-sm text-gray-300">{feature.name}</td>
                      <td className="px-6 py-3.5 text-center">{renderCell(feature.free)}</td>
                      <td className="px-6 py-3.5 text-center bg-accent-500/[0.02]">{renderCell(feature.smePremium)}</td>
                      <td className="px-6 py-3.5 text-center">{renderCell(feature.investor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Success Commission Note */}
          <div className="mt-12 glass-card-light p-6 text-center">
            <h3 className="text-sm font-semibold text-white mb-2">Success Commission</h3>
            <p className="text-sm text-gray-400">
              3–5% of deal value on deals ≥ ৳5,00,000 confirmed through a deal room,
              split between SME and investor. Recorded by admin upon deal closure.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
