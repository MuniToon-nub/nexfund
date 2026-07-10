import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { User, OTP } from '@/lib/db/models';
import { generateOTP, hashOTP, getOTPExpiry } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email/resend';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset code has been sent.',
      });
    }

    const otpCode = generateOTP();
    const otpHash = await hashOTP(otpCode);
    await OTP.deleteMany({ email, purpose: 'reset' });
    await OTP.create({
      email,
      codeHash: otpHash,
      expiresAt: getOTPExpiry(),
      purpose: 'reset',
    });

    await sendOTPEmail(email, otpCode, 'reset');

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
