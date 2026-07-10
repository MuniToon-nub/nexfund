'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/ui/Navbar';
import { Mail, Lock, User, Phone, Building2, TrendingUp } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<'sme' | 'investor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select your account type');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role,
    });

    if (result.success) {
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } else {
      setError(result.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-navy-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="glass-card p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-sm text-gray-400">Join NexFund BD to connect with opportunities</p>
            </div>

            {/* Role selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole('sme')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'sme'
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-navy-600 bg-navy-800/50 text-gray-400 hover:border-navy-500'
                }`}
              >
                <Building2 size={24} />
                <span className="text-sm font-medium">SME Founder</span>
                <span className="text-xs text-gray-500">Post your pitch</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('investor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'investor'
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-navy-600 bg-navy-800/50 text-gray-400 hover:border-navy-500'
                }`}
              >
                <TrendingUp size={24} />
                <span className="text-sm font-medium">Investor</span>
                <span className="text-xs text-gray-500">Find deals</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                icon={<User size={18} />}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+880 1XXX XXXXXX"
                icon={<Phone size={18} />}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                icon={<Lock size={18} />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<Lock size={18} />}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
