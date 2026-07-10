import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';

// Routes that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/verify-otp',
  '/reset-password',
  '/pricing',
  '/about',
];

// Route prefixes that require specific roles
const roleRoutes: Record<string, string[]> = {
  '/sme': ['sme'],
  '/investor': ['investor'],
  '/admin': ['admin'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes — they handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = verifyAccessToken(token);

    // Check role-based access
    for (const [prefix, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(prefix) && !allowedRoles.includes(payload.role)) {
        // Redirect to the user's own dashboard
        const dashboardUrl = new URL(`/${payload.role}/dashboard`, req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // Inject user info into headers for server components
    const headers = new Headers(req.headers);
    headers.set('x-user-id', payload.userId);
    headers.set('x-user-role', payload.role);
    headers.set('x-user-tier', payload.tier);
    headers.set('x-user-email', payload.email);

    return NextResponse.next({ request: { headers } });
  } catch {
    // Token invalid/expired — redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
