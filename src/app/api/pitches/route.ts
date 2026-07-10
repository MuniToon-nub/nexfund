import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { Pitch } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';
import { scoreLegitimacy } from '@/lib/ai/legitimacy-scorer';
import { TIER_LIMITS } from '@/types';

const pitchSchema = z.object({
  businessName: z.string().min(2),
  industry: z.enum(['e-commerce', 'light-manufacturing', 'agro-processing-agritech', 'tech-enabled-services', 'other']),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  fundingAsk: z.number().int().positive(),
  fundingType: z.enum(['equity', 'debt', 'revenue-share']),
  yearsOperating: z.number().min(0),
  employeeCount: z.number().min(0),
  location: z.enum(['Dhaka', 'Chattogram', 'Sylhet', 'Other']),
  documents: z.object({
    tradeLicenseUrl: z.string().optional(),
    tinCertificateUrl: z.string().optional(),
    pitchDeckUrl: z.string().optional(),
    financialsUrl: z.string().optional(),
  }).optional(),
});

// POST — create pitch
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'sme') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = pitchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();

    // Enforce tier limits
    const existingCount = await Pitch.countDocuments({
      ownerId: payload.userId,
      status: { $ne: 'closed' },
    });
    const limit = TIER_LIMITS[payload.tier].maxPitches;
    if (existingCount >= limit) {
      return NextResponse.json(
        { success: false, error: `Free tier allows ${limit} active pitch. Upgrade to Premium for unlimited pitches.` },
        { status: 402 }
      );
    }

    const pitch = await Pitch.create({
      ownerId: payload.userId,
      ...parsed.data,
      status: 'pending_review',
    });

    // Run legitimacy scoring asynchronously (but await for MVP)
    const { score, flags } = await scoreLegitimacy(pitch);
    pitch.legitimacyScore = score;
    pitch.legitimacyFlags = flags;
    await pitch.save();

    return NextResponse.json({
      success: true,
      data: pitch,
    }, { status: 201 });
  } catch (error) {
    console.error('Create pitch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET — list current user's pitches
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (payload.role === 'sme') {
      const pitches = await Pitch.find({ ownerId: payload.userId }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: pitches });
    }

    // Investors see active pitches (used by feed)
    if (payload.role === 'investor') {
      const pitches = await Pitch.find({ status: 'active' })
        .select('-documents')
        .sort({ createdAt: -1 })
        .limit(50);
      return NextResponse.json({ success: true, data: pitches });
    }

    // Admin sees all
    if (payload.role === 'admin') {
      const pitches = await Pitch.find({}).sort({ createdAt: -1 }).limit(100);
      return NextResponse.json({ success: true, data: pitches });
    }

    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('List pitches error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
