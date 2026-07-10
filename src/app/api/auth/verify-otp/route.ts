import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { User, OTP } from '@/lib/db/models';
import { verifyOTP as verifyOTPCode, signAccessToken, signRefreshToken } from '@/lib/auth';
import type { JWTPayload } from '@/types';

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    await connectDB();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      purpose: 'signup',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = await verifyOTPCode(code, otpRecord.codeHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Clean up OTPs
    await OTP.deleteMany({ email, purpose: 'signup' });

    // Issue tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tier: user.subscriptionTier,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tier: user.subscriptionTier,
        },
      },
    });

    // Set refresh token as httpOnly cookie
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
