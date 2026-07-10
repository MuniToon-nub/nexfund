import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Brain,
  Handshake,
  CheckCircle,
  TrendingUp,
  Building2,
  Star,
  Zap,
  Target,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-24 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-navy-700/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent-500/3 to-transparent rounded-full" />
          </div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-xs font-medium mb-6 animate-fade-in">
              <Zap size={14} />
              AI-Powered SME-Investor Matching for Bangladesh
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
              Bridge the{' '}
              <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                ৳3.8 Lakh Crore
              </span>
              <br />
              SME Financing Gap
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              NexFund BD uses AI to match verified Bangladeshi SMEs with the right investors.
              No cold outreach. No unvetted pitches. Just trust-scored, data-driven connections.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-200 text-base"
              >
                <Building2 size={20} />
                I&apos;m an SME Founder
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-navy-600 hover:border-accent-500 text-white font-semibold rounded-xl transition-all duration-200 text-base hover:text-accent-400"
              >
                <TrendingUp size={20} />
                I&apos;m an Investor
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="relative border-y border-white/5 bg-navy-900/50">
          <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
            {[
              { value: '11.7M', label: 'SMEs in Bangladesh', sub: 'Powering 25% of GDP' },
              { value: '৳3.8L Cr', label: 'Financing Gap', sub: '~USD 2.8 Billion' },
              { value: '14–31%', label: 'Informal Lending Rates', sub: 'Crushing small businesses' },
              { value: '< 5%', label: 'Access Formal Finance', sub: 'The rest are locked out' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-accent-400 mb-0.5">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How NexFund BD Works
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Three steps from pitch to funding. No gatekeepers, no middlemen.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 stagger-children">
              {[
                {
                  icon: Shield,
                  step: '01',
                  title: 'Post & Verify',
                  desc: 'SMEs submit their pitch and upload KYC documents. Our AI runs legitimacy checks and assigns a trust score before any investor sees it.',
                  color: 'from-accent-500/20 to-accent-600/5',
                },
                {
                  icon: Brain,
                  step: '02',
                  title: 'AI Matches',
                  desc: 'Our matching engine scores compatibility across industry fit, ticket size, risk appetite, and semantic alignment — delivering ranked results, not random lists.',
                  color: 'from-blue-500/20 to-blue-600/5',
                },
                {
                  icon: Handshake,
                  step: '03',
                  title: 'Deal Room',
                  desc: 'Matched pairs connect in private deal rooms with messaging, document sharing, and status tracking — from first contact to closed deal.',
                  color: 'from-purple-500/20 to-purple-600/5',
                },
              ].map((item, i) => (
                <div key={i} className="glass-card p-8 relative group hover:border-accent-500/30 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} className="text-white" />
                  </div>
                  <div className="text-xs font-bold text-accent-500/60 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-24 px-4 border-y border-white/5 bg-navy-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-xs font-medium mb-4">
                  <Shield size={14} />
                  Trust Built In
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Every Pitch is Verified Before It&apos;s Seen
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Unlike pitch events or cold outreach, NexFund BD verifies trade licenses, TIN certificates,
                  and business details before a pitch reaches any investor. Our legitimacy scoring catches
                  duplicates, anomalies, and red flags — so investors browse pre-vetted deals only.
                </p>
                <div className="space-y-4">
                  {[
                    'Trade license & TIN document verification',
                    'AI-powered legitimacy scoring (0–100)',
                    'Duplicate detection & anomaly flagging',
                    'Admin manual review for edge cases',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-accent-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center">
                    <Target size={24} className="text-accent-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Acme AgriTech Ltd.</div>
                    <div className="text-xs text-gray-400">Agro-Processing • Dhaka</div>
                  </div>
                </div>

                {/* Mock score display */}
                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Document Verification', score: 95, color: 'bg-accent-500' },
                    { label: 'Business Consistency', score: 88, color: 'bg-accent-500' },
                    { label: 'Financial Viability', score: 72, color: 'bg-warning-400' },
                    { label: 'Market Potential', score: 85, color: 'bg-accent-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white font-medium">{item.score}%</span>
                      </div>
                      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-sm text-gray-400">Overall Trust Score</span>
                  <span className="text-2xl font-bold text-accent-400">85/100</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>

            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {[
                {
                  name: 'SME Free',
                  price: '৳0',
                  period: 'forever',
                  features: ['1 active pitch', '5 AI matches/month', '1 deal room', 'KYC badge'],
                  cta: 'Get Started',
                  highlight: false,
                },
                {
                  name: 'SME Premium',
                  price: '৳2,500',
                  period: '/month',
                  features: ['Unlimited pitches', '25 matches/month', '5 deal rooms', 'AI pitch suggestions', 'Analytics dashboard'],
                  cta: 'Upgrade',
                  highlight: true,
                },
                {
                  name: 'Investor',
                  price: '৳1,500',
                  period: '/month',
                  features: ['Unlimited ranked feed', 'Saved filters', 'Full deal room access', 'Portfolio tracking', 'Early access to pitches'],
                  cta: 'Subscribe',
                  highlight: false,
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`glass-card p-6 text-left relative ${
                    plan.highlight ? 'border-accent-500/40 shadow-lg shadow-accent-500/5' : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
                      POPULAR
                    </div>
                  )}
                  <div className="text-sm text-gray-400 mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-accent-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20'
                        : 'border border-navy-600 text-white hover:border-accent-500 hover:text-accent-400'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Trusted by Founders & Investors</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {[
                {
                  quote: 'NexFund BD matched us with three serious investors within our first week. The legitimacy score gave them confidence to engage immediately.',
                  name: 'Rashida Akter',
                  title: 'CEO, GreenByte AgriTech',
                  role: 'SME Founder',
                },
                {
                  quote: 'Instead of attending 10 pitch events, I get a curated feed of pre-verified deals ranked by my preferences. The time savings alone justify the subscription.',
                  name: 'Kamal Hossain',
                  title: 'Angel Investor, Dhaka',
                  role: 'Investor',
                },
                {
                  quote: 'The KYC verification process weeds out unserious applicants. As an investor, I only see pitches from businesses that have skin in the game.',
                  name: 'Fatima Noor',
                  title: 'Managing Partner, Noor Ventures',
                  role: 'Investor',
                },
              ].map((t, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={16} className="text-warning-400 fill-warning-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.title}</div>
                    <div className="text-xs text-accent-400 mt-0.5">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent pointer-events-none" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to close the funding gap?
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Join 500+ SMEs and investors already using NexFund BD to build trust-driven
                  investment relationships.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all text-base"
                  >
                    Create Free Account
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Learn more about our mission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                    N
                  </div>
                  <span className="text-sm font-bold text-white">
                    NexFund <span className="text-accent-400">BD</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  AI-powered SME-investor matchmaking for Bangladesh.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-xs text-gray-400 hover:text-white transition-colors">Pricing</Link>
                  <Link href="/about" className="block text-xs text-gray-400 hover:text-white transition-colors">About</Link>
                  <Link href="/signup" className="block text-xs text-gray-400 hover:text-white transition-colors">Sign Up</Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">For SMEs</h4>
                <div className="space-y-2">
                  <Link href="/signup" className="block text-xs text-gray-400 hover:text-white transition-colors">Post a Pitch</Link>
                  <Link href="/pricing" className="block text-xs text-gray-400 hover:text-white transition-colors">Premium Plans</Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">For Investors</h4>
                <div className="space-y-2">
                  <Link href="/signup" className="block text-xs text-gray-400 hover:text-white transition-colors">Browse Deals</Link>
                  <Link href="/pricing" className="block text-xs text-gray-400 hover:text-white transition-colors">Subscription</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">© 2026 NexFund BD. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
