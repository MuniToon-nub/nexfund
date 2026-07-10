import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { DealRoom } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';

// GET /api/deal-rooms/[id] — get deal room with messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const dealRoom = await DealRoom.findById(id)
      .populate('participants', 'name email role')
      .populate({
        path: 'matchId',
        populate: { path: 'pitchId', select: 'businessName industry fundingAsk' },
      });

    if (!dealRoom) {
      return NextResponse.json({ success: false, error: 'Deal room not found' }, { status: 404 });
    }

    // Check participant
    const isParticipant = dealRoom.participants.some(
      (p: { _id: { toString: () => string } }) => p._id.toString() === payload.userId
    );
    if (!isParticipant && payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: dealRoom });
  } catch (error) {
    console.error('Get deal room error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/deal-rooms/[id] — send message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, attachmentUrl } = z.object({
      content: z.string().min(1),
      attachmentUrl: z.string().optional(),
    }).parse(body);

    await connectDB();

    const dealRoom = await DealRoom.findById(id);
    if (!dealRoom) {
      return NextResponse.json({ success: false, error: 'Deal room not found' }, { status: 404 });
    }

    const isParticipant = dealRoom.participants.some(
      (p: { toString: () => string }) => p.toString() === payload.userId
    );
    if (!isParticipant) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    dealRoom.messages.push({
      sender: payload.userId as unknown as import('mongoose').Types.ObjectId,
      content,
      attachmentUrl,
      timestamp: new Date(),
    });
    await dealRoom.save();

    return NextResponse.json({
      success: true,
      data: dealRoom.messages[dealRoom.messages.length - 1],
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/deal-rooms/[id] — update deal status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { dealStatus, dealValue } = z.object({
      dealStatus: z.enum(['open', 'negotiating', 'closed_won', 'closed_lost']),
      dealValue: z.number().optional(),
    }).parse(body);

    await connectDB();

    const dealRoom = await DealRoom.findById(id);
    if (!dealRoom) {
      return NextResponse.json({ success: false, error: 'Deal room not found' }, { status: 404 });
    }

    dealRoom.dealStatus = dealStatus;
    if (dealValue && dealStatus === 'closed_won') {
      dealRoom.dealValue = dealValue;
      dealRoom.commissionAmount = Math.round(dealValue * dealRoom.commissionRate);
    }
    await dealRoom.save();

    return NextResponse.json({ success: true, data: dealRoom });
  } catch (error) {
    console.error('Update deal room error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
