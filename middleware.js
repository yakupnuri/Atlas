import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['nl', 'en', 'tr'],
  defaultLocale: 'nl'
});

export const config = {
  matcher: ['/', '/(nl|en|tr)/:path*']
};