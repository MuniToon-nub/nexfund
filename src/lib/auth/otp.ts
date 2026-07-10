import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Generate a random 6-digit OTP code.
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash an OTP code before storing in the database.
 */
export async function hashOTP(code: string): Promise<string> {
  return bcrypt.hash(code, SALT_ROUNDS);
}

/**
 * Verify an OTP code against a stored hash.
 */
export async function verifyOTP(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/**
 * Get OTP expiration date (10 minutes from now).
 */
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
