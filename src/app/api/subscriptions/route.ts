import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { Subscription, User } from '@/lib/db/models';
import { getAuthPayload } from '@/lib/auth';
import { initiatePayment, verifyPayment } from '@/lib/payments/bkash-stub';

// POST /api/subscriptions — initiate subscription
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { paymentMethod } = z.object({
      paymentMethod: z.enum(['bkash', 'nagad', 'sslcommerz']).default('bkash'),
    }).parse(body);

    const amount = payload.role === 'sme' ? 2500 : 1500;

    // Initiate mock payment
    const payment = await initiatePayment(amount, payload.userId);

    // Auto-verify in sandbox mode
    const verification = await verifyPayment(payment.paymentID);

    if (verification.status !== 'completed') {
      return NextResponse.json({ success: false, error: 'Payment failed' }, { status: 400 });
    }

    await connectDB();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create subscription
    const subscription = await Subscription.create({
      userId: payload.userId,
      tier: 'premium',
      amount,
      billingCycle: 'monthly',
      paymentMethod,
      status: 'active',
      startDate,
      endDate,
    });

    // Upgrade user tier
    await User.findByIdAndUpdate(payload.userId, {
      subscriptionTier: 'premium',
      subscriptionExpiresAt: endDate,
    });

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        transactionId: verification.transactionID,
        message: 'Subscription activated! You now have Premium access.',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/subscriptions — get current subscription status
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthPayload(req.headers);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const subscription = await Subscription.findOne({
      userId: payload.userId,
      status: 'active',
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        tier: payload.tier,
        subscription,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
