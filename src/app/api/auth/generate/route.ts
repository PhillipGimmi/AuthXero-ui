// src/app/api/auth/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';

// Constants
const AUTH_DOMAIN =
  process.env.NODE_ENV === 'production'
    ? 'https://dashauth.com'
    : 'http://localhost:3000';

const DOMAIN_REGEX =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
const PLATFORM_TYPES = ['spa', 'website', 'android', 'ios'] as const;
const REQUEST_TIMEOUT = 5000; // 5 seconds
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 3600000; // 1 hour in milliseconds

// Types
type PlatformType = (typeof PLATFORM_TYPES)[number];

interface GenerateRequest {
  domain: string;
  platformType: PlatformType;
  timestamp: string;
}

type GenerateResponse = {
  status: 'success' | 'error';
  clientId?: string;
  domain?: string;
  scriptUrl?: string;
  platformType?: PlatformType;
  message?: string;
  errors?: string[];
};

// Rate limiting implementation (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Request validation schema
const requestSchema = z
  .object({
    domain: z.string().regex(DOMAIN_REGEX, 'Invalid domain format'),
    platformType: z.enum(PLATFORM_TYPES, {
      errorMap: () => ({
        message: `Platform type must be one of: ${PLATFORM_TYPES.join(', ')}`,
      }),
    }),
    timestamp: z.string().datetime('Invalid timestamp format'),
  })
  .transform(
    (data): GenerateRequest => ({
      domain: data.domain,
      platformType: data.platformType,
      timestamp: data.timestamp,
    }),
  );

// Helper functions
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

async function isDomainAvailable(domain: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'DashAuth-DomainValidator/1.0',
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('[Domain Check] Error:', {
      domain,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

function generateClientId(): string {
  return crypto.randomUUID();
}

// Gets the client IP from various request headers and proxies
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Default to a placeholder if no IP can be determined
  return 'unknown';
}

// Main handler
export async function POST(
  request: NextRequest,
): Promise<NextResponse<GenerateResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();

  // Get client IP for rate limiting
  const clientIp = getClientIp(request);

  try {
    // Rate limiting check
    if (!(await checkRateLimit(clientIp))) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rate limit exceeded',
        } as GenerateResponse,
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
            'Retry-After': '3600',
          },
        },
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid content type',
        } as GenerateResponse,
        {
          status: 415,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid JSON payload',
        } as GenerateResponse,
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    const validationResult = requestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message);
      console.error('[Generate] Validation errors:', {
        requestId,
        errors,
        receivedData: rawBody,
      });

      return NextResponse.json(
        {
          status: 'error',
          message: 'Validation failed',
          errors,
        } as GenerateResponse,
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    const { domain, platformType }: GenerateRequest = validationResult.data;

    // Check domain availability
    if (!(await isDomainAvailable(domain))) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Domain is not accessible or invalid',
        } as GenerateResponse,
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    // Generate client configuration
    const clientId = generateClientId();
    const scriptUrl = `${AUTH_DOMAIN}/auth/${clientId}/auth.js`;

    console.log('[Generate] Configuration generated:', {
      requestId,
      clientId,
      domain,
      platformType,
      scriptUrl,
      duration: `${Math.round(performance.now() - startTime)}ms`,
    });

    const response: GenerateResponse = {
      status: 'success',
      clientId,
      domain,
      platformType,
      scriptUrl,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'X-Request-ID': requestId,
      },
    });
  } catch (error) {
    console.error('[Generate] Error:', {
      requestId,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : 'Unknown error',
      duration: `${Math.round(performance.now() - startTime)}ms`,
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'An unexpected error occurred',
      } as GenerateResponse,
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
      },
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
