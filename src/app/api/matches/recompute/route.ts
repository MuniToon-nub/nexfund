import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/auth';
import { recomputeAllMatches } from '@/lib/ai/matching-engine';

// POST /api/matches/recompute — admin trigger
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    const result = await recomputeAllMatches();

    return NextResponse.json({
      success: true,
      data: result,
      message: `Recomputed matches for ${result.pitchCount} pitches, created ${result.totalMatches} total matches`,
    });
  } catch (error) {
    console.error('Recompute matches error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
