// src/app/api/auth/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';

// Constants
const AUTH_DOMAIN =
  process.env.NODE_ENV === 'production'
    ? 'https://dashauth.com'
    : 'http://localhost:3000';

const API_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? 'https://api.dashauth.com'
    : 'http://localhost:8080';

const PLATFORM_TYPES = ['spa', 'website', 'android', 'ios'] as const;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DOMAIN_REGEX =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

// Types
type PlatformType = (typeof PLATFORM_TYPES)[number];

interface CompleteRequest {
  clientId: string;
  domain: string;
  platformType: PlatformType;
}

type CompleteResponse = {
  status: 'success' | 'error';
  message?: string;
  errors?: string[];
  config?: {
    scriptUrl: string;
    authEndpoint: string;
    clientId: string;
    type: PlatformType;
  };
};

// Request validation schema
const requestSchema = z
  .object({
    clientId: z.string().regex(UUID_REGEX, 'Invalid client ID format'),
    domain: z.string().regex(DOMAIN_REGEX, 'Invalid domain format'),
    platformType: z.enum(PLATFORM_TYPES),
  })
  .transform(
    (data): CompleteRequest => ({
      clientId: data.clientId,
      domain: data.domain,
      platformType: data.platformType,
    }),
  );

// Cache implementation (use Redis in production)
const configCache = new Map<
  string,
  {
    config: NonNullable<CompleteResponse['config']>;
    timestamp: number;
  }
>();
const CACHE_TTL = 300000; // 5 minutes

// Helper functions
async function getConfigFromCache(
  clientId: string,
): Promise<CompleteResponse['config'] | null> {
  const cached = configCache.get(clientId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.config;
  }
  return null;
}

async function setConfigInCache(
  clientId: string,
  config: NonNullable<CompleteResponse['config']>,
): Promise<void> {
  configCache.set(clientId, {
    config,
    timestamp: Date.now(),
  });
}

async function verifyClientConfiguration(clientId: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_ENDPOINT}/verify-client/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('[Client Verification] Error:', error);
    return false;
  }
}

// Main handler
export async function POST(
  request: NextRequest,
): Promise<NextResponse<CompleteResponse>> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();

  console.log('[Setup Complete] Request received', {
    requestId,
    timestamp: new Date().toISOString(),
  });

  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid content type',
        } as CompleteResponse,
        { status: 415 },
      );
    }

    // Parse and validate request body
    const rawBody = await request.json();
    const validationResult = requestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message);
      console.error('[Setup Complete] Validation errors:', {
        requestId,
        errors,
        receivedData: rawBody,
      });

      return NextResponse.json(
        {
          status: 'error',
          message: 'Validation failed',
          errors,
        } as CompleteResponse,
        { status: 400 },
      );
    }

    // Use the CompleteRequest type from validation
    const { clientId, domain, platformType }: CompleteRequest =
      validationResult.data;

    // Check cache first
    const cachedConfig = await getConfigFromCache(clientId);
    if (cachedConfig) {
      console.log('[Setup Complete] Cache hit:', {
        requestId,
        clientId,
        duration: `${Math.round(performance.now() - startTime)}ms`,
      });

      return NextResponse.json(
        {
          status: 'success',
          message: 'Setup completed successfully',
          config: cachedConfig,
        } as CompleteResponse,
        {
          status: 200,
          headers: {
            'Cache-Control': 'private, max-age=300',
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        },
      );
    }

    // Verify client configuration
    const isValidClient = await verifyClientConfiguration(clientId);
    if (!isValidClient) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid client configuration',
        } as CompleteResponse,
        { status: 404 },
      );
    }

    // Generate configuration
    const scriptUrl = `${AUTH_DOMAIN}/auth/${clientId}/auth.js`;
    const config = {
      scriptUrl,
      authEndpoint: `${API_ENDPOINT}/auth`,
      clientId,
      type: platformType,
    };

    // Cache the configuration
    await setConfigInCache(clientId, config);

    console.log('[Setup Complete] Success:', {
      requestId,
      clientId,
      domain,
      platformType,
      duration: `${Math.round(performance.now() - startTime)}ms`,
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Setup completed successfully',
        config,
      } as CompleteResponse,
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-Request-ID': requestId,
        },
      },
    );
  } catch (error) {
    console.error('[Setup Complete] Error:', {
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
        message: 'An unexpected error occurred while completing setup',
      } as CompleteResponse,
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
