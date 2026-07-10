import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { InvestorPreference } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';

const prefSchema = z.object({
  industries: z.array(z.enum(['e-commerce', 'light-manufacturing', 'agro-processing-agritech', 'tech-enabled-services', 'other'])).min(1),
  minTicket: z.number().int().min(0),
  maxTicket: z.number().int().positive(),
  riskAppetite: z.enum(['low', 'medium', 'high']),
  preferredLocations: z.array(z.enum(['Dhaka', 'Chattogram', 'Sylhet', 'Other'])).min(1),
  freeTextPreferences: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'investor') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = prefSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();

    const prefs = await InvestorPreference.findOneAndUpdate(
      { investorId: payload.userId },
      { ...parsed.data, investorId: payload.userId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: prefs }, { status: 201 });
  } catch (error) {
    console.error('Set preferences error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'investor') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const prefs = await InvestorPreference.findOne({ investorId: payload.userId });

    return NextResponse.json({ success: true, data: prefs });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
