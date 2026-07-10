import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { User, OTP } from '@/lib/db/models';
import { verifyOTP as verifyOTPCode, hashPassword } from '@/lib/auth';

const resetSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = parsed.data;
    await connectDB();

    const otpRecord = await OTP.findOne({
      email,
      purpose: 'reset',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Reset code expired or not found' },
        { status: 400 }
      );
    }

    const isValid = await verifyOTPCode(code, otpRecord.codeHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset code' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await User.findOneAndUpdate({ email }, { passwordHash });
    await OTP.deleteMany({ email, purpose: 'reset' });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
