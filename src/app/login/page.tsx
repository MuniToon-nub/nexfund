'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/ui/Navbar';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect will be handled by auth context
      window.location.href = '/';
    } else if (result.needsVerification) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-32 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-navy-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="glass-card p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center font-bold text-white text-lg mx-auto mb-4 shadow-lg shadow-accent-500/20">
                N
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-sm text-gray-400">Sign in to your NexFund BD account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex justify-end">
                <Link
                  href="/reset-password"
                  className="text-xs text-accent-400 hover:text-accent-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
