import { NextRequest, NextResponse } from 'next/server';
import { AuthXeroClient, AuthXeroError } from '@/lib/authxero';

const AUTH_TOKEN_NAME = 'authxero_token';
const AUTH_REFRESH_TOKEN_NAME = 'authxero_refresh_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  ...(process.env.NODE_ENV === 'production' && {
    domain: process.env.COOKIE_DOMAIN,
  }),
} as const;

async function handleAuth(request: NextRequest, mode: 'login' | 'register') {
  try {
    const { email, password, name } = await request.json();
    const client = new AuthXeroClient();

    const authResponse = await (mode === 'login'
      ? client.login({ email, password })
      : client.signup({ email, password, name })); // Added name parameter

    const response = NextResponse.json(
      {
        success: true,
        user: authResponse.user,
      },
      { status: 200 },
    );

    response.cookies.set(AUTH_TOKEN_NAME, authResponse.token, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set(AUTH_REFRESH_TOKEN_NAME, authResponse.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (pathname.includes('/login')) {
    return handleAuth(request, 'login');
  }

  if (pathname.includes('/register')) {
    return handleAuth(request, 'register');
  }

  return NextResponse.json(
    { success: false, message: 'Invalid endpoint' },
    { status: 404 },
  );
}

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (pathname.includes('/me')) {
    try {
      const token = request.cookies.get(AUTH_TOKEN_NAME)?.value;
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 },
        );
      }

      const client = new AuthXeroClient();
      const user = await client.verifySession(token);

      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
      const message =
        error instanceof AuthXeroError
          ? error.message
          : 'An unexpected error occurred';
      const status = error instanceof AuthXeroError ? error.status : 500;
      return NextResponse.json({ success: false, message }, { status });
    }
  }

  return NextResponse.json(
    { success: false, message: 'Invalid endpoint' },
    { status: 404 },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
