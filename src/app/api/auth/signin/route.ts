import { NextRequest, NextResponse } from 'next/server';
import { AuthXeroClient, AuthXeroError } from '@/lib/authxero';

const AUTH_TOKEN_NAME = 'authxero_token';
const AUTH_REFRESH_TOKEN_NAME = 'authxero_refresh_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
};

async function handleAuth(request: NextRequest, mode: 'login' | 'register') {
  const requestId = crypto.randomUUID();
  console.group(`Auth Request (${mode}): ${requestId}`);
  console.time(`auth-request-${requestId}`);
  console.log('Request Details:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
    mode,
    timestamp: new Date().toISOString(),
  });

  try {
    const { email, password, name } = await request.json();
    console.log('Parsed Request Body:', {
      hasEmail: !!email,
      hasPassword: !!password,
      hasName: !!name,
      timestamp: new Date().toISOString(),
    });

    const client = new AuthXeroClient();
    console.log('Initiating AuthXero Client Request', {
      mode,
      timestamp: new Date().toISOString(),
    });

    // Ensure that tokens are returned upon registration
    const authResponse = await (mode === 'login'
      ? client.login({ email, password })
      : client.signup({ email, password, name }));

    if (
      !authResponse.token ||
      !authResponse.refreshToken ||
      !authResponse.user
    ) {
      throw new Error('Authentication tokens not received from the server');
    }

    console.log('AuthXero Response:', {
      success: true,
      hasUser: !!authResponse.user,
      hasToken: !!authResponse.token,
      hasRefreshToken: !!authResponse.refreshToken,
      userVerified: authResponse.user?.email_verified,
      timestamp: new Date().toISOString(),
    });

    const cookieOptions = {
      ...COOKIE_OPTIONS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      path: '/',
    };

    const response = NextResponse.json(
      {
        success: true,
        user: authResponse.user,
        requiresVerification: !authResponse.user.email_verified,
        requestId,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
      },
    );

    console.log('Setting Cookies:', {
      authToken: {
        name: AUTH_TOKEN_NAME,
        maxAge: 60 * 60 * 24,
        options: cookieOptions,
        hasToken: !!authResponse.token,
        timestamp: new Date().toISOString(),
      },
      refreshToken: {
        name: AUTH_REFRESH_TOKEN_NAME,
        maxAge: 60 * 60 * 24 * 7,
        options: cookieOptions,
        hasRefreshToken: !!authResponse.refreshToken,
        timestamp: new Date().toISOString(),
      },
    });

    // Set authentication tokens in cookies
    response.cookies.set(AUTH_TOKEN_NAME, authResponse.token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 24 hours
    });

    response.cookies.set(AUTH_REFRESH_TOKEN_NAME, authResponse.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Auth Error:', {
      type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof AuthXeroError ? error.status : 500,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;

    return NextResponse.json(
      {
        success: false,
        message,
        requestId,
      },
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
      },
    );
  } finally {
    console.timeEnd(`auth-request-${requestId}`);
    console.groupEnd();
  }
}

async function handleGetUser(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.group(`Get User Request: ${requestId}`);
  console.time(`get-user-${requestId}`);
  console.log('Request Details:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
    timestamp: new Date().toISOString(),
  });

  try {
    const token = request.cookies.get(AUTH_TOKEN_NAME)?.value;
    console.log('Token Check:', { hasToken: !!token });

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 },
      );
    }

    const client = new AuthXeroClient();
    console.log('Verifying session with AuthXero');
    const user = await client.verifySession(token);

    console.log('Session Verified:', {
      success: true,
      hasUser: !!user,
      userVerified: user.email_verified,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('Get User Error:', {
      type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof AuthXeroError ? error.status : 500,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;
    return NextResponse.json({ success: false, message }, { status });
  } finally {
    console.timeEnd(`get-user-${requestId}`);
    console.groupEnd();
  }
}

async function handleRefreshToken(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.group(`Refresh Token Request: ${requestId}`);
  console.time(`refresh-token-${requestId}`);
  console.log('Request Details:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
    timestamp: new Date().toISOString(),
  });

  try {
    const oldRefreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_NAME)?.value;
    console.log('Refresh Token Check:', { hasRefreshToken: !!oldRefreshToken });

    if (!oldRefreshToken) {
      console.log('No refresh token provided');
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 },
      );
    }

    const client = new AuthXeroClient();
    console.log('Requesting new tokens from AuthXero');
    const { token, refreshToken } = await client.refreshToken(oldRefreshToken);

    console.log('Token Refresh Response:', {
      success: true,
      hasNewToken: !!token,
      hasNewRefreshToken: !!refreshToken,
      timestamp: new Date().toISOString(),
    });

    const response = NextResponse.json({ success: true }, { status: 200 });

    console.log('Setting New Cookies:', {
      authToken: {
        name: AUTH_TOKEN_NAME,
        maxAge: 60 * 60 * 24,
        options: COOKIE_OPTIONS,
      },
      refreshToken: {
        name: AUTH_REFRESH_TOKEN_NAME,
        maxAge: 60 * 60 * 24 * 7,
        options: COOKIE_OPTIONS,
      },
      timestamp: new Date().toISOString(),
    });

    response.cookies.set(AUTH_TOKEN_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set(AUTH_REFRESH_TOKEN_NAME, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Token Refresh Error:', {
      type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof AuthXeroError ? error.status : 500,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;
    return NextResponse.json({ success: false, message }, { status });
  } finally {
    console.timeEnd(`refresh-token-${requestId}`);
    console.groupEnd();
  }
}

async function handleLogout(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.group(`Logout Request: ${requestId}`);
  console.time(`logout-${requestId}`);
  console.log('Request Details:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
    timestamp: new Date().toISOString(),
  });

  try {
    const token = request.cookies.get(AUTH_TOKEN_NAME)?.value;
    console.log('Token Check:', { hasToken: !!token });

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 },
      );
    }

    const client = new AuthXeroClient();
    console.log('Initiating logout with AuthXero');
    await client.logout(token);

    console.log('Logout successful, clearing cookies');
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 },
    );

    response.cookies.delete(AUTH_TOKEN_NAME);
    response.cookies.delete(AUTH_REFRESH_TOKEN_NAME);

    return response;
  } catch (error) {
    console.error('Logout Error:', {
      type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof AuthXeroError ? error.status : 500,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;
    return NextResponse.json({ success: false, message }, { status });
  } finally {
    console.timeEnd(`logout-${requestId}`);
    console.groupEnd();
  }
}

async function handleEmailVerification(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.group(`Email Verification Request: ${requestId}`);
  console.time(`email-verification-${requestId}`);

  try {
    const token = request.cookies.get(AUTH_TOKEN_NAME)?.value;
    console.log('Token Check:', {
      hasToken: !!token,
      cookies: Object.keys(Object.fromEntries(request.cookies)),
      timestamp: new Date().toISOString(),
    });

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication token not found. Please log in again.',
          requestId,
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    const { code } = await request.json();
    console.log('Verification Code Check:', {
      hasCode: !!code,
      codeLength: code?.length,
      timestamp: new Date().toISOString(),
    });

    if (!code) {
      console.log('No verification code provided');
      return NextResponse.json(
        {
          success: false,
          message: 'Verification code required',
          requestId,
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    const client = new AuthXeroClient();
    const verificationResponse = await client.verifyEmail(code, token);

    console.log('Verification Response:', {
      success: true,
      message: verificationResponse.message,
      status: verificationResponse.status,
      timestamp: new Date().toISOString(),
    });

    // Refresh the auth token cookie
    const cookieOptions = {
      ...COOKIE_OPTIONS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      path: '/',
    };

    const response = NextResponse.json(
      {
        success: true,
        message: verificationResponse.message,
        status: verificationResponse.status,
        requestId,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
      },
    );

    // Refresh the auth token to extend its validity
    response.cookies.set(AUTH_TOKEN_NAME, token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Email Verification Error:', {
      type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof AuthXeroError ? error.status : 500,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const message =
      error instanceof AuthXeroError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof AuthXeroError ? error.status : 500;

    return NextResponse.json(
      {
        success: false,
        message,
        requestId,
      },
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
      },
    );
  } finally {
    console.timeEnd(`email-verification-${requestId}`);
    console.groupEnd();
  }
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  console.log('POST Request:', {
    pathname,
    timestamp: new Date().toISOString(),
  });

  if (pathname.includes('/login')) {
    return handleAuth(request, 'login');
  }

  if (pathname.includes('/register')) {
    return handleAuth(request, 'register');
  }

  if (pathname.includes('/refresh-token')) {
    return handleRefreshToken(request);
  }

  if (pathname.includes('/logout')) {
    return handleLogout(request);
  }

  if (pathname.includes('/verify-email')) {
    return handleEmailVerification(request);
  }

  console.log('Invalid endpoint:', pathname);
  return NextResponse.json(
    { success: false, message: 'Invalid endpoint' },
    { status: 404 },
  );
}

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  console.log('GET Request:', {
    pathname,
    timestamp: new Date().toISOString(),
  });

  if (pathname.includes('/me')) {
    return handleGetUser(request);
  }

  console.log('Invalid endpoint:', pathname);
  return NextResponse.json(
    { success: false, message: 'Invalid endpoint' },
    { status: 404 },
  );
}

export async function OPTIONS() {
  console.log('OPTIONS Request:', { timestamp: new Date().toISOString() });
  return new NextResponse(null, { status: 204 });
}
