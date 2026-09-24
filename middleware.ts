import { verifyCloudflareAccess } from '@/lib/cloudflare/access';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const user = await verifyCloudflareAccess(request);
  return user ? NextResponse.next() : new NextResponse('Forbidden', { status: 403 });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
