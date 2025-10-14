import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if path is under /admin
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If not authenticated, redirect to NextAuth signin
    if (!token) {
      const loginUrl = new URL('/api/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Special check for CRM paths - require @stichtingatlas.com email
    if (pathname.startsWith('/admin/crm')) {
      const email = token.email;
      const isAtlasEmail = email && email.toLowerCase().endsWith('@stichtingatlas.com');
      
      if (!isAtlasEmail) {
        // Redirect to dashboard with error message
        const dashboardUrl = new URL('/admin/dashboard', request.url);
        dashboardUrl.searchParams.set('error', 'crm_access_denied');
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
