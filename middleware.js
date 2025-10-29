import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo.png') ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next();
  }

  // Allow admin login page
  if (pathname === '/admin/login' || pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check maintenance mode
  try {
    // Use internal URL without SSL
    const maintenanceUrl = `http://localhost:3000/api/maintenance`;
    const maintenanceResponse = await fetch(maintenanceUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const maintenanceData = await maintenanceResponse.json();

    if (maintenanceData.enabled) {
      // Check if user is authenticated (admin bypass)
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        // Not authenticated - show maintenance page
        return NextResponse.rewrite(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    console.error('Maintenance check error:', error);
    // Continue normally if maintenance check fails
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)']
};
