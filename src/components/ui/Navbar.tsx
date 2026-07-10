'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    return `/${user.role}/dashboard`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-shadow">
              N
            </div>
            <span className="text-lg font-bold text-white">
              Nex<span className="text-accent-400">Fund</span>{' '}
              <span className="text-xs text-gray-400 font-normal">BD</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
              About
            </Link>

            {loading ? (
              <div className="w-20 h-9 skeleton" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardLink()}>
                  <Button variant="secondary" size="sm">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-navy-800"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-3 animate-fade-in">
            <Link
              href="/pricing"
              className="block text-sm text-gray-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block text-sm text-gray-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full text-left text-sm text-gray-400 hover:text-white py-2 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
