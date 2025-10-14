import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login page without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // For now, we'll use client-side authentication check
  // Middleware disabled to avoid redirect loops
  // Authentication will be handled in individual pages
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
