'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { ShieldCheck } from 'lucide-react';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOTP, user } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dest = user.role === 'admin' ? '/admin' : `/${user.role}/onboarding`;
      router.push(dest);
    }
  }, [user, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    const result = await verifyOTP(email, fullCode);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      });
    } catch {
      // Silent fail — UX still shows countdown
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="glass-card p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-500/10 border border-accent-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-accent-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
          <p className="text-sm text-gray-400">
            We sent a 6-digit code to{' '}
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Verify Email
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Didn&apos;t receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`font-medium transition-colors ${
              resendCooldown > 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-accent-400 hover:text-accent-300'
            }`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
        </div>
        <Suspense fallback={<div className="w-full max-w-md h-96 skeleton" />}>
          <VerifyOTPContent />
        </Suspense>
      </main>
    </>
  );
}
