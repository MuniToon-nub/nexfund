import jwt from 'jsonwebtoken';
import type { JWTPayload } from '@/types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
}

/**
 * Extract JWT from Authorization header or cookie.
 * Returns null if no valid token is found.
 */
export function extractToken(headers: Headers): string | null {
  // Try Authorization header first
  const authHeader = headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie
  const cookieHeader = headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [key, ...rest] = c.split('=');
        return [key, rest.join('=')];
      })
    );
    if (cookies['access_token']) return cookies['access_token'];
  }

  return null;
}

/**
 * Verify token and return payload, or null if invalid/expired.
 */
export function getAuthPayload(headers: Headers): JWTPayload | null {
  const token = extractToken(headers);
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
