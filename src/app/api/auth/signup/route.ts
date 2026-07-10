import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { User, OTP } from '@/lib/db/models';
import { hashPassword, generateOTP, hashOTP, getOTPExpiry } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email/resend';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['sme', 'investor'], { error: 'Role must be sme or investor' }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role } = parsed.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      isVerified: false,
      kycStatus: 'pending',
      subscriptionTier: 'free',
    });

    // Generate and send OTP
    const otpCode = generateOTP();
    const otpHash = await hashOTP(otpCode);
    await OTP.deleteMany({ email, purpose: 'signup' }); // Remove old OTPs
    await OTP.create({
      email,
      codeHash: otpHash,
      expiresAt: getOTPExpiry(),
      purpose: 'signup',
    });

    await sendOTPEmail(email, otpCode, 'signup');

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please check your email for a verification code.',
        data: { email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
