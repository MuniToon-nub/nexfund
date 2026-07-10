import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import { ArrowRight, Target, Users, Shield, TrendingUp, Globe, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Closing the{' '}
              <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                SME Financing Gap
              </span>
              {' '}in Bangladesh
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              11.7 million SMEs drive Bangladesh&apos;s economy, yet fewer than 5% can access formal
              financing. The rest are trapped in a cycle of informal lending at crushing rates.
              NexFund BD exists to change that.
            </p>
          </div>

          {/* The Problem */}
          <section className="mb-20">
            <div className="glass-card p-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target size={24} className="text-danger-400" />
                The Problem
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">For SME Founders</h3>
                  <ul className="space-y-3">
                    {[
                      'No access to vetted, active investors',
                      'Cold outreach has < 2% response rate',
                      'Pitch events are expensive and infrequent',
                      'Informal lenders charge 14–31% interest',
                      'No way to prove legitimacy to strangers',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">For Investors</h3>
                  <ul className="space-y-3">
                    {[
                      'No centralized, pre-vetted deal flow',
                      'Manual due diligence is time-consuming',
                      'Hard to assess legitimacy from a pitch deck alone',
                      'Industry/size mismatch wastes time',
                      'No structured deal tracking',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Our Solution */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <TrendingUp size={24} className="text-accent-400" />
              Our Solution
            </h2>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {[
                {
                  icon: Shield,
                  title: 'Trust Verification',
                  desc: 'Every SME undergoes KYC document checks and AI-powered legitimacy scoring before their pitch is visible to any investor.',
                },
                {
                  icon: Target,
                  title: 'AI Matching',
                  desc: 'Our matching engine combines structured criteria (industry, ticket size, risk) with NLP semantic matching to rank investor-pitch fit.',
                },
                {
                  icon: Users,
                  title: 'Structured Deal Rooms',
                  desc: 'Matched pairs connect in private, tracked deal rooms with messaging, document sharing, and deal status management.',
                },
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 hover:border-accent-500/20 transition-all">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={24} className="text-accent-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Market Context */}
          <section className="mb-20">
            <div className="glass-card p-10 border-accent-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe size={24} className="text-accent-400" />
                The Opportunity
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '11.7M', label: 'SMEs', sub: 'in Bangladesh' },
                  { value: '25%', label: 'of GDP', sub: 'driven by SMEs' },
                  { value: '~$2.8B', label: 'Financing Gap', sub: '৳3.8 Lakh Crore' },
                  { value: '85M+', label: 'Mobile Users', sub: 'smartphone-first' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-accent-400">{stat.value}</div>
                    <div className="text-sm font-medium text-white">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-20">
            <div className="glass-card p-10 bg-gradient-to-br from-accent-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <Heart size={24} className="text-accent-400" />
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                We believe every legitimate business deserves access to capital, and every investor
                deserves access to pre-vetted, fundable deals. NexFund BD builds trust into the
                platform itself — so the gap between &ldquo;I need funding&rdquo; and &ldquo;I found a great investment&rdquo;
                shrinks to a few clicks.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to bridge the gap?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 transition-all"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
