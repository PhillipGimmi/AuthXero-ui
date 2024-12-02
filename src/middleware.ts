import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, X-Refresh-Token, X-Request-ID',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, X-Request-ID',
  'Access-Control-Max-Age': '86400',
};

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff', 
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off',
  'Content-Security-Policy': "default-src 'self' http://localhost:8080; connect-src 'self' http://localhost:8080; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

function addHeaders(response: NextResponse, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestId = request.headers.get('X-Request-ID') ?? crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        ...securityHeaders,
        'X-Request-ID': requestId,
      },
    });
  }

  const response = NextResponse.next();

  response.headers.set('X-Request-ID', requestId);
  addHeaders(response, securityHeaders);

  if (pathname.startsWith('/api/') || pathname.startsWith('/api/v1/auth/')) {
    addHeaders(response, corsHeaders);
  }

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/v1/auth/:path*',
    '/((?!_next|favicon.ico|public|assets|images).*)',
  ],
};