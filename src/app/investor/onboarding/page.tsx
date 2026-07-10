'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { TrendingUp, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  { value: 'e-commerce', label: 'E-Commerce' },
  { value: 'light-manufacturing', label: 'Light Manufacturing' },
  { value: 'agro-processing-agritech', label: 'Agro-Processing / AgriTech' },
  { value: 'tech-enabled-services', label: 'Tech-Enabled Services' },
  { value: 'other', label: 'Other' },
];

const LOCATIONS = [
  { value: 'Dhaka', label: 'Dhaka' },
  { value: 'Chattogram', label: 'Chattogram' },
  { value: 'Sylhet', label: 'Sylhet' },
  { value: 'Other', label: 'Other' },
];

export default function InvestorOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [riskAppetite, setRiskAppetite] = useState('medium');
  const [minTicket, setMinTicket] = useState('');
  const [maxTicket, setMaxTicket] = useState('');
  const [freeText, setFreeText] = useState('');

  const toggleIndustry = (val: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const toggleLocation = (val: string) => {
    setSelectedLocations((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedIndustries.length === 0) {
      setError('Select at least one industry');
      return;
    }
    if (selectedLocations.length === 0) {
      setError('Select at least one location');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/investor-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industries: selectedIndustries,
          minTicket: Number(minTicket) || 0,
          maxTicket: Number(maxTicket) || 10000000,
          riskAppetite,
          preferredLocations: selectedLocations,
          freeTextPreferences: freeText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/investor/dashboard');
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-navy-950 pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-accent-500/10 border border-accent-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-accent-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Set your investment preferences</h1>
          <p className="text-sm text-gray-400">We&apos;ll use these to rank and match pitches for you</p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up">
          {error && (
            <div className="mb-6 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Industries</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    type="button"
                    onClick={() => toggleIndustry(ind.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedIndustries.includes(ind.value)
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                        : 'bg-navy-800 text-gray-400 border border-navy-600 hover:border-navy-500'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Size */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Ticket (BDT)"
                type="number"
                placeholder="e.g., 500000"
                value={minTicket}
                onChange={(e) => setMinTicket(e.target.value)}
              />
              <Input
                label="Max Ticket (BDT)"
                type="number"
                placeholder="e.g., 5000000"
                value={maxTicket}
                onChange={(e) => setMaxTicket(e.target.value)}
              />
            </div>

            {/* Risk Appetite */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Risk Appetite</label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setRiskAppetite(level)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      riskAppetite === level
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                        : 'bg-navy-800 text-gray-400 border border-navy-600 hover:border-navy-500'
                    }`}
                  >
                    {level === 'low' ? '🛡️' : level === 'medium' ? '⚖️' : '🚀'} {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Locations</label>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => toggleLocation(loc.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedLocations.includes(loc.value)
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                        : 'bg-navy-800 text-gray-400 border border-navy-600 hover:border-navy-500'
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Describe your ideal investment</label>
              <textarea
                className="w-full bg-navy-800 border border-navy-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all px-4 py-3 text-sm min-h-[100px] resize-y"
                placeholder="e.g., I'm looking for early-stage agritech companies in Dhaka with strong unit economics and at least 2 years of operation..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">Used for AI semantic matching</p>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Save Preferences & Start Browsing <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
