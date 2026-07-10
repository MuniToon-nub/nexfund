'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Building2, FileText, Lightbulb, BadgeDollarSign, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const STEPS = ['Business Info', 'Documents', 'Pitch Details', 'Funding'];

const industryOptions = [
  { value: '', label: 'Select industry' },
  { value: 'e-commerce', label: 'E-Commerce' },
  { value: 'light-manufacturing', label: 'Light Manufacturing' },
  { value: 'agro-processing-agritech', label: 'Agro-Processing / AgriTech' },
  { value: 'tech-enabled-services', label: 'Tech-Enabled Services' },
  { value: 'other', label: 'Other' },
];

const locationOptions = [
  { value: '', label: 'Select location' },
  { value: 'Dhaka', label: 'Dhaka' },
  { value: 'Chattogram', label: 'Chattogram' },
  { value: 'Sylhet', label: 'Sylhet' },
  { value: 'Other', label: 'Other' },
];

const fundingTypeOptions = [
  { value: '', label: 'Select funding type' },
  { value: 'equity', label: 'Equity' },
  { value: 'debt', label: 'Debt' },
  { value: 'revenue-share', label: 'Revenue Share' },
];

export default function SMEOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    yearsOperating: 0,
    employeeCount: 0,
    location: '',
    tradeLicenseUrl: '',
    tinCertificateUrl: '',
    pitchDeckUrl: '',
    description: '',
    fundingAsk: 0,
    fundingType: '',
  });

  const update = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          industry: form.industry,
          description: form.description,
          fundingAsk: Number(form.fundingAsk),
          fundingType: form.fundingType,
          yearsOperating: Number(form.yearsOperating),
          employeeCount: Number(form.employeeCount),
          location: form.location,
          documents: {
            tradeLicenseUrl: form.tradeLicenseUrl || undefined,
            tinCertificateUrl: form.tinCertificateUrl || undefined,
            pitchDeckUrl: form.pitchDeckUrl || undefined,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/sme/dashboard');
      } else {
        setError(data.error || 'Failed to create pitch');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-navy-950 pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Set up your pitch</h1>
          <p className="text-sm text-gray-400">Complete these steps to start getting matched with investors</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-10 px-4">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                  i < step ? 'bg-accent-500 text-white' :
                  i === step ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40' :
                  'bg-navy-800 text-gray-500 border border-navy-600'
                }`}>
                  {i < step ? <Check size={18} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i <= step ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${i < step ? 'bg-accent-500' : 'bg-navy-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8 animate-fade-in-up">
          {error && (
            <div className="mb-6 p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-accent-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Business Information</h2>
                  <p className="text-xs text-gray-400">Tell us about your business</p>
                </div>
              </div>
              <Input label="Business Name" placeholder="e.g., GreenByte AgriTech Ltd." value={form.businessName} onChange={(e) => update('businessName', e.target.value)} required />
              <Select label="Industry" options={industryOptions} value={form.industry} onChange={(e) => update('industry', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Years Operating" type="number" min={0} value={form.yearsOperating} onChange={(e) => update('yearsOperating', e.target.value)} />
                <Input label="Employees" type="number" min={0} value={form.employeeCount} onChange={(e) => update('employeeCount', e.target.value)} />
              </div>
              <Select label="Location" options={locationOptions} value={form.location} onChange={(e) => update('location', e.target.value)} />
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Verification Documents</h2>
                  <p className="text-xs text-gray-400">Upload URLs to your documents (Cloudinary, Drive, etc.)</p>
                </div>
              </div>
              <Input label="Trade License URL" placeholder="https://..." value={form.tradeLicenseUrl} onChange={(e) => update('tradeLicenseUrl', e.target.value)} />
              <Input label="TIN Certificate URL" placeholder="https://..." value={form.tinCertificateUrl} onChange={(e) => update('tinCertificateUrl', e.target.value)} />
              <Input label="Pitch Deck URL (optional)" placeholder="https://..." value={form.pitchDeckUrl} onChange={(e) => update('pitchDeckUrl', e.target.value)} />
              <p className="text-xs text-gray-500">
                Documents help improve your legitimacy score. Pitches with verified documents rank higher.
              </p>
            </div>
          )}

          {/* Step 3: Pitch Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Lightbulb size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Your Pitch</h2>
                  <p className="text-xs text-gray-400">Describe your business and why investors should fund it</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Business Description</label>
                <textarea
                  className="w-full bg-navy-800 border border-navy-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all px-4 py-3 text-sm min-h-[200px] resize-y"
                  placeholder="Describe what your business does, the problem it solves, your traction, and what makes it a great investment..."
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {form.description.length}/200 minimum characters
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Funding */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
                  <BadgeDollarSign size={20} className="text-accent-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Funding Ask</h2>
                  <p className="text-xs text-gray-400">How much are you looking to raise?</p>
                </div>
              </div>
              <Input
                label="Funding Amount (BDT)"
                type="number"
                placeholder="e.g., 5000000"
                value={form.fundingAsk}
                onChange={(e) => update('fundingAsk', e.target.value)}
              />
              {form.fundingAsk > 0 && (
                <p className="text-xs text-gray-400">
                  ≈ USD {(Number(form.fundingAsk) / 110).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              )}
              <Select label="Funding Type" options={fundingTypeOptions} value={form.fundingType} onChange={(e) => update('fundingType', e.target.value)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ArrowLeft size={16} /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading}>
                Submit Pitch <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
