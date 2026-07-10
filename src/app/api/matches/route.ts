import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Match, Pitch } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';
import { TIER_LIMITS } from '@/types';

// GET /api/matches — get matches for the current user
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (payload.role === 'sme') {
      // Get matches for SME's pitches
      const pitches = await Pitch.find({ ownerId: payload.userId });
      const pitchIds = pitches.map((p) => p._id);

      const limit = TIER_LIMITS[payload.tier].maxMatchesPerMonth;
      const matches = await Match.find({ pitchId: { $in: pitchIds } })
        .sort({ compatibilityScore: -1 })
        .limit(limit)
        .populate('investorId', 'name email');

      // For free tier, hide full breakdown after top 5
      const data = matches.map((m, i) => ({
        _id: m._id,
        pitchId: m.pitchId,
        investorId: m.investorId,
        compatibilityScore: m.compatibilityScore,
        matchBreakdown: payload.tier === 'premium' || i < 5 ? m.matchBreakdown : null,
        status: m.status,
        createdAt: m.createdAt,
      }));

      return NextResponse.json({ success: true, data });
    }

    if (payload.role === 'investor') {
      // Investor's ranked pitch feed
      const matches = await Match.find({ investorId: payload.userId })
        .sort({ compatibilityScore: -1 })
        .limit(50)
        .populate({
          path: 'pitchId',
          select: 'businessName industry description fundingAsk fundingType location legitimacyScore status viewCount',
        });

      return NextResponse.json({ success: true, data: matches });
    }

    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
