import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Pitch } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';

// GET /api/admin/kyc — get KYC review queue
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    await connectDB();

    const pitches = await Pitch.find({
      status: { $in: ['pending_review', 'flagged'] },
    })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: 1 }); // oldest first

    return NextResponse.json({ success: true, data: pitches });
  } catch (error) {
    console.error('KYC queue error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/kyc — approve/flag/reject a pitch
export async function PUT(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    const { pitchId, action, reason } = await req.json();

    await connectDB();

    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return NextResponse.json({ success: false, error: 'Pitch not found' }, { status: 404 });
    }

    switch (action) {
      case 'approve':
        pitch.status = 'active';
        pitch.legitimacyScore = Math.min(pitch.legitimacyScore + 20, 100);
        // Also update user KYC status
        const { User } = await import('@/lib/db/models');
        await User.findByIdAndUpdate(pitch.ownerId, { kycStatus: 'verified' });
        break;
      case 'flag':
        pitch.status = 'flagged';
        if (reason) pitch.legitimacyFlags.push(reason);
        break;
      case 'reject':
        pitch.status = 'closed';
        if (reason) pitch.legitimacyFlags.push(reason);
        const UserModel = (await import('@/lib/db/models')).User;
        await UserModel.findByIdAndUpdate(pitch.ownerId, { kycStatus: 'rejected' });
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    await pitch.save();

    return NextResponse.json({
      success: true,
      data: pitch,
      message: `Pitch ${action}${action === 'approve' ? 'd' : action === 'flag' ? 'ged' : 'ed'} successfully`,
    });
  } catch (error) {
    console.error('KYC action error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
