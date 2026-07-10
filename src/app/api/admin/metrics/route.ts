import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { User, Pitch, Match, DealRoom, Subscription } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';

// GET /api/admin/metrics — platform metrics
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    await connectDB();

    const [
      totalSMEs,
      totalInvestors,
      totalPitches,
      activePitches,
      totalMatches,
      openDealRooms,
      closedDeals,
      activeSubscriptions,
    ] = await Promise.all([
      User.countDocuments({ role: 'sme' }),
      User.countDocuments({ role: 'investor' }),
      Pitch.countDocuments({}),
      Pitch.countDocuments({ status: 'active' }),
      Match.countDocuments({}),
      DealRoom.countDocuments({ dealStatus: { $in: ['open', 'negotiating'] } }),
      DealRoom.countDocuments({ dealStatus: 'closed_won' }),
      Subscription.countDocuments({ status: 'active' }),
    ]);

    // Calculate MRR
    const subscriptions = await Subscription.find({ status: 'active' });
    const mrr = subscriptions.reduce((sum, s) => sum + s.amount, 0);

    // Commission owed
    const wonDeals = await DealRoom.find({ dealStatus: 'closed_won' });
    const totalCommission = wonDeals.reduce((sum, d) => sum + (d.commissionAmount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalSMEs,
        totalInvestors,
        totalPitches,
        activePitches,
        totalMatches,
        openDealRooms,
        closedDeals,
        activeSubscriptions,
        mrr,
        totalCommission,
      },
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
