export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/map/:path*',
    '/spacecraft/:path*',
    '/missions/:path*',
    '/alerts/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ],
};
