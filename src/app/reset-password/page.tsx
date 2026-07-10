'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/ui/Navbar';
import { Mail, Lock, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('code');
      } else {
        setError(data.error || 'Failed to send reset code');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('done');
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="glass-card p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-navy-800 border border-navy-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound size={28} className="text-accent-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {step === 'done' ? 'Password Reset!' : 'Reset Password'}
              </h1>
              <p className="text-sm text-gray-400">
                {step === 'email' && "Enter your email and we'll send a reset code"}
                {step === 'code' && `Enter the code sent to ${email}`}
                {step === 'done' && 'Your password has been reset successfully'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Send Reset Code
                </Button>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Reset Code"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  icon={<Lock size={18} />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm password"
                  icon={<Lock size={18} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Reset Password
                </Button>
              </form>
            )}

            {step === 'done' && (
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Go to Login
                </Button>
              </Link>
            )}

            <p className="mt-6 text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
