import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { DealRoom, Match } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';
import { TIER_LIMITS } from '@/types';

// POST — create deal room from a match
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { matchId } = z.object({ matchId: z.string() }).parse(body);

    await connectDB();

    // Check match exists and user is a participant
    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }

    const isParticipant =
      match.investorId.toString() === payload.userId ||
      match.pitchId.toString() === payload.userId;

    // Enforce deal room limits for SME
    if (payload.role === 'sme') {
      const existingRooms = await DealRoom.countDocuments({
        participants: payload.userId,
        dealStatus: { $in: ['open', 'negotiating'] },
      });
      const limit = TIER_LIMITS[payload.tier].maxDealRooms;
      if (existingRooms >= limit) {
        return NextResponse.json(
          { success: false, error: `You've reached the ${limit} deal room limit. Upgrade to Premium for more.` },
          { status: 402 }
        );
      }
    }

    // Check if deal room already exists for this match
    const existing = await DealRoom.findOne({ matchId });
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    // Determine participants (SME owner + investor)
    const { Pitch } = await import('@/lib/db/models');
    const pitch = await Pitch.findById(match.pitchId);
    if (!pitch) {
      return NextResponse.json({ success: false, error: 'Pitch not found' }, { status: 404 });
    }

    const dealRoom = await DealRoom.create({
      matchId,
      participants: [pitch.ownerId, match.investorId],
      messages: [],
      dealStatus: 'open',
      commissionRate: 0.03,
    });

    // Update match status
    match.status = 'deal_room_opened';
    await match.save();

    return NextResponse.json({ success: true, data: dealRoom }, { status: 201 });
  } catch (error) {
    console.error('Create deal room error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET — list user's deal rooms
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const dealRooms = await DealRoom.find({ participants: payload.userId })
      .sort({ updatedAt: -1 })
      .populate('participants', 'name email role')
      .populate({
        path: 'matchId',
        populate: { path: 'pitchId', select: 'businessName industry' },
      });

    return NextResponse.json({ success: true, data: dealRooms });
  } catch (error) {
    console.error('List deal rooms error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
