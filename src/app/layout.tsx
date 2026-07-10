import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NexFund BD — AI-Powered SME-Investor Matchmaking',
  description:
    'Connect Bangladeshi SME entrepreneurs with vetted private investors through AI-powered matching, KYC verification, and structured deal rooms.',
  keywords: ['SME', 'investor', 'Bangladesh', 'funding', 'AI matching', 'startup', 'fintech'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
