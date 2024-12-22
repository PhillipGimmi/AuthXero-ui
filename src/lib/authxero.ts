import type {
  AuthXeroUser,
  AuthXeroLoginResponse,
  AuthCredentials,
  SignUpCredentials,
  AuthErrorResponse,
  EmailVerificationResponse,
  TokenResponse,
} from '@/types/auth';

const AUTHXERO_BASE_URL =
  process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080';

const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VERIFY_EMAIL: '/api/auth/verify-email',
  RESEND_VERIFICATION: '/api/auth/resend-verification',
  ME: '/api/auth/me',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  LOGOUT: '/api/auth/logout',
} as const;

export class AuthXeroClient {
  private readonly baseUrl: string;
  private readonly requestLogger: Console;

  constructor(config: { baseUrl?: string; logger?: Console } = {}) {
    this.baseUrl = config.baseUrl ?? AUTHXERO_BASE_URL;
    this.requestLogger = config.logger ?? console;
    this.requestLogger.info('AuthXeroClient initialized', {
      baseUrl: this.baseUrl,
    });
  }

  private async handleResponse<T>(
    response: Response,
    requestId: string,
  ): Promise<T> {
    const responseDetails = {
      requestId,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
    };

    this.requestLogger.debug('Response received', responseDetails);

    if (!response.ok) {
      let errorData: AuthErrorResponse;
      try {
        errorData = await response.json();
        this.requestLogger.error('Error response received', {
          ...responseDetails,
          error: errorData,
        });
        throw new AuthXeroError(
          errorData.message || 'Unknown error occurred',
          errorData.status_code ?? response.status,
          errorData.error_code ?? 'UNKNOWN_ERROR',
        );
      } catch (e) {
        if (e instanceof AuthXeroError) throw e;
        this.requestLogger.error('Failed to parse error response', {
          error: e,
          response: responseDetails,
        });
        throw new AuthXeroError(
          'Failed to process server response',
          response.status,
          'RESPONSE_PARSING_ERROR',
        );
      }
    }

    try {
      const data = await response.json();
      this.requestLogger.debug('Response successfully parsed', {
        requestId,
        hasData: !!data,
      });
      return data;
    } catch (e) {
      this.requestLogger.error('Failed to parse success response', {
        error: e,
        response: responseDetails,
      });
      throw new AuthXeroError(
        'Failed to parse server response',
        500,
        'RESPONSE_PARSING_ERROR',
      );
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
  ): Promise<T> {
    const requestId = crypto.randomUUID();
    const startTime = performance.now();

    this.requestLogger.group(`API Request: ${requestId}`);

    try {
      const url = new URL(endpoint, this.baseUrl).toString();
      const headers = new Headers(options.headers);

      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      headers.set('X-Request-ID', requestId);

      const requestDetails = {
        requestId,
        url,
        method: options.method,
        headers: Object.fromEntries(headers.entries()),
      };

      this.requestLogger.info('Making request', requestDetails);

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        signal: options.signal ?? AbortSignal.timeout(30000),
      });

      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('Retry-After') ?? '60',
          10,
        );
        this.requestLogger.warn('Rate limit exceeded', {
          requestId,
          retryAfter,
        });
        throw new AuthXeroError(
          `Rate limit exceeded. Please retry in ${retryAfter} seconds`,
          429,
          'RATE_LIMIT_EXCEEDED',
        );
      }

      return await this.handleResponse<T>(response, requestId);
    } catch (error) {
      if (error instanceof AuthXeroError) throw error;

      const errorDetails = {
        requestId,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint,
      };

      this.requestLogger.error('Request failed', errorDetails);

      if (error instanceof TypeError) {
        throw new AuthXeroError('Network error occurred', 0, 'NETWORK_ERROR');
      }

      throw new AuthXeroError(
        'An unexpected error occurred',
        500,
        'INTERNAL_ERROR',
      );
    } finally {
      const duration = performance.now() - startTime;
      this.requestLogger.info('Request completed', {
        requestId,
        durationMs: Math.round(duration),
      });
      this.requestLogger.groupEnd();
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthXeroLoginResponse> {
    this.requestLogger.group('Login attempt');
    try {
      // Log the login attempt
      this.requestLogger.info('Attempting login', {
        email: credentials.email,
        timestamp: new Date().toISOString(),
      });

      // Make the request
      const response = await this.makeRequest<AuthXeroLoginResponse>(
        ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        },
      );

      // Validate response
      if (!response.user || !response.token || !response.refreshToken) {
        this.requestLogger.error('Invalid server response', {
          hasUser: !!response.user,
          hasToken: !!response.token,
          hasRefreshToken: !!response.refreshToken,
        });
        throw new AuthXeroError(
          'Invalid response from server',
          500,
          'INVALID_RESPONSE',
        );
      }

      // Normalize the response
      const normalizedResponse = {
        ...response,
        user: {
          ...response.user,
          // Explicitly handle verification status
          // undefined or null should be treated as verified for existing users
          email_verified: response.user.email_verified !== false,
        },
        requiresVerification: response.user.email_verified === false,
      };

      // Log successful login
      this.requestLogger.info('Login successful', {
        userId: normalizedResponse.user.id,
        emailVerified: normalizedResponse.user.email_verified,
        requiresVerification: normalizedResponse.requiresVerification,
        timestamp: new Date().toISOString(),
      });

      return normalizedResponse;
    } catch (error) {
      // Enhanced error logging
      this.requestLogger.error('Login error', {
        type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof AuthXeroError) {
        if (error.isUnauthorized()) {
          throw new AuthXeroError(
            'Invalid email or password',
            401,
            'INVALID_CREDENTIALS',
          );
        }
        if (error.isForbidden()) {
          throw new AuthXeroError(
            'Email verification required',
            403,
            'EMAIL_NOT_VERIFIED',
          );
        }
        throw error;
      }

      throw new AuthXeroError('Login failed', 500, 'LOGIN_ERROR');
    } finally {
      this.requestLogger.groupEnd();
    }
  }

  async signup(credentials: SignUpCredentials): Promise<AuthXeroLoginResponse> {
    this.requestLogger.group('Signup attempt');
    try {
      if (
        !credentials.name?.trim() ||
        !credentials.email?.trim() ||
        !credentials.password
      ) {
        throw new AuthXeroError(
          'All fields are required',
          400,
          'VALIDATION_ERROR',
        );
      }

      const response = await this.makeRequest<AuthXeroLoginResponse>(
        ENDPOINTS.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify({
            name: credentials.name.trim(),
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        },
      );

      this.requestLogger.info('Signup successful', {
        userId: response.user?.id,
        requiresVerification: !response.user?.email_verified,
      });

      return response;
    } catch (error) {
      if (error instanceof AuthXeroError) {
        if (error.isConflict()) {
          throw new AuthXeroError(
            'Account already exists',
            409,
            'EMAIL_EXISTS',
          );
        }
        throw error;
      }
      throw new AuthXeroError('Registration failed', 500, 'REGISTRATION_ERROR');
    } finally {
      this.requestLogger.groupEnd();
    }
  }

  async verifyEmail(
    code: string,
    token: string,
  ): Promise<EmailVerificationResponse> {
    this.requestLogger.group('Email verification');
    try {
      if (!code?.trim() || !token?.trim()) {
        throw new AuthXeroError(
          'Verification code and token are required',
          400,
          'VALIDATION_ERROR',
        );
      }

      return await this.makeRequest<EmailVerificationResponse>(
        ENDPOINTS.VERIFY_EMAIL,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ code: code.trim() }),
        },
      );
    } catch (error) {
      if (error instanceof AuthXeroError) {
        if (error.isInvalidRequest()) {
          throw new AuthXeroError(
            'Invalid verification code',
            400,
            'INVALID_CODE',
          );
        }
        if (error.isRateLimited()) {
          throw new AuthXeroError(
            'Too many attempts, please try again later',
            429,
            'TOO_MANY_ATTEMPTS',
          );
        }
        throw error;
      }
      throw new AuthXeroError('Verification failed', 500, 'VERIFICATION_ERROR');
    } finally {
      this.requestLogger.groupEnd();
    }
  }

  async verifySession(token: string): Promise<AuthXeroUser> {
    this.requestLogger.group('Session verification');
    try {
      if (!token?.trim()) {
        throw new AuthXeroError('Valid token required', 401, 'INVALID_TOKEN');
      }

      return await this.makeRequest<AuthXeroUser>(ENDPOINTS.ME, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error instanceof AuthXeroError && error.isUnauthorized()) {
        throw new AuthXeroError('Session expired', 401, 'SESSION_EXPIRED');
      }
      throw new AuthXeroError(
        'Session verification failed',
        500,
        'VERIFICATION_ERROR',
      );
    } finally {
      this.requestLogger.groupEnd();
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    this.requestLogger.group('Token refresh');
    try {
      if (!refreshToken?.trim()) {
        throw new AuthXeroError(
          'Valid refresh token required',
          401,
          'INVALID_TOKEN',
        );
      }

      return await this.makeRequest<TokenResponse>(ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: { 'X-Refresh-Token': refreshToken },
      });
    } catch (error) {
      if (error instanceof AuthXeroError && error.isUnauthorized()) {
        throw new AuthXeroError(
          'Invalid refresh token',
          401,
          'INVALID_REFRESH_TOKEN',
        );
      }
      throw new AuthXeroError('Token refresh failed', 500, 'REFRESH_ERROR');
    } finally {
      this.requestLogger.groupEnd();
    }
  }

  async logout(token: string): Promise<void> {
    this.requestLogger.group('Logout attempt');
    try {
      if (!token?.trim()) {
        throw new AuthXeroError('Valid token required', 401, 'INVALID_TOKEN');
      }

      await this.makeRequest<void>(ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      this.requestLogger.info('Logout successful');
    } catch (error) {
      throw new AuthXeroError('Logout failed', 500, 'LOGOUT_ERROR');
    } finally {
      this.requestLogger.groupEnd();
    }
  }
}

export class AuthXeroError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorCode: string = 'UNKNOWN_ERROR', // Made errorCode required with a default value
  ) {
    super(message);
    this.name = 'AuthXeroError';
    Object.setPrototypeOf(this, AuthXeroError.prototype);
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }
  isForbidden(): boolean {
    return this.status === 403;
  }
  isNotFound(): boolean {
    return this.status === 404;
  }
  isConflict(): boolean {
    return this.status === 409;
  }
  isInvalidRequest(): boolean {
    return this.status === 400;
  }
  isRateLimited(): boolean {
    return this.status === 429;
  }
  isServerError(): boolean {
    return this.status >= 500;
  }
}
