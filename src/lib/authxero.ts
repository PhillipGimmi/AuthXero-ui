import type { 
  AuthXeroUser,
  AuthXeroLoginResponse,
  AuthCredentials,
  SignUpCredentials, 
  AuthErrorResponse,
  EmailVerificationResponse,
  TokenResponse,
 } from '@/types/auth';
 
 const AUTHXERO_BASE_URL = process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080';
 
 const ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register', 
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
  ME: '/api/v1/auth/me',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  LOGOUT: '/api/v1/auth/logout'
 } as const;
 
 export class AuthXeroClient {
  private readonly baseUrl: string;
 
  constructor(config: { baseUrl?: string } = {}) {
    this.baseUrl = config.baseUrl ?? AUTHXERO_BASE_URL;
  }
 
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: AuthErrorResponse;
      try {
        errorData = await response.json();
        const statusCode = errorData.status_code ?? 500;
        throw new AuthXeroError(
          errorData.message,
          statusCode,
          errorData.error_code
        );
      } catch (e) {
        if (e instanceof AuthXeroError) throw e;
        throw new AuthXeroError(
          'An error occurred while processing the response',
          response.status
        );
      }
    }
    return response.json();
  }
 
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const headers = new Headers(options.headers);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
 
      const response = await fetch(url, {
        ...options,
        headers
      });
 
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
        throw new AuthXeroError(
          `Rate limit exceeded. Try again in ${retryAfter} seconds`,
          429,
          'RATE_LIMIT_EXCEEDED'
        );
      }
 
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof AuthXeroError) throw error;
      
      throw new AuthXeroError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        500,
        'INTERNAL_SERVER_ERROR'
      );
    }
  }
 
  async login(credentials: AuthCredentials): Promise<AuthXeroLoginResponse> {
    try {
      const response = await this.makeRequest<AuthXeroLoginResponse>(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
  
      // Normalize `emailVerified` to `email_verified` for consistency
      return {
        ...response,
        user: {
          ...response.user,
          email_verified: response.user.email_verified ?? response.user.email_verified,
        },
      };
    } catch (error) {
      if (error instanceof AuthXeroError) {
        if (error.isUnauthorized()) {
          throw new AuthXeroError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        } else if (error.isForbidden()) {
          throw new AuthXeroError('Please verify your email before signing in', 403, 'EMAIL_NOT_VERIFIED');
        }
      }
      throw new AuthXeroError('Login failed', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 
  async signup(credentials: SignUpCredentials): Promise<AuthXeroLoginResponse> {
    const requestId = crypto.randomUUID();
    console.group(`Signup Request: ${requestId}`);
    console.time(`signup-${requestId}`);
    
    try {
      console.log('Validating Credentials:', {
        requestId,
        hasName: !!credentials.name,
        nameLength: credentials.name?.length,
        hasEmail: !!credentials.email,
        emailLength: credentials.email?.length,
        hasPassword: !!credentials.password,
        passwordLength: credentials.password?.length,
        timestamp: new Date().toISOString()
      });
  
      if (!credentials.name || !credentials.email || !credentials.password) {
        console.error('Validation Failed:', {
          requestId,
          missingFields: {
            name: !credentials.name,
            email: !credentials.email,
            password: !credentials.password
          }
        });
        throw new AuthXeroError('Name, email, and password are required', 400, 'VALIDATION_ERROR');
      }
  
      console.log('Making Registration Request:', {
        requestId,
        endpoint: ENDPOINTS.REGISTER,
        method: 'POST',
        payload: {
          email: credentials.email,
          name: credentials.name,
          hasPassword: !!credentials.password
        }
      });
  
      const response = await this.makeRequest<AuthXeroLoginResponse>(ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name
        })
      });
  
      console.log('Registration Response:', {
        requestId,
        success: true,
        hasUser: !!response.user,
        hasToken: !!response.token,
        hasRefreshToken: !!response.refreshToken,
        userVerified: response.user?.email_verified,
        timestamp: new Date().toISOString()
      });
  
      return response;
    } catch (error) {
      console.error('Registration Error:', {
        requestId,
        type: error instanceof AuthXeroError ? 'AuthXeroError' : 'Unknown',
        code: error instanceof AuthXeroError ? error.errorCode : 'UNKNOWN',
        status: error instanceof AuthXeroError ? error.status : 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
  
      if (error instanceof AuthXeroError) {
        if (error.isConflict()) {
          throw new AuthXeroError('Email already exists', 409, 'EMAIL_EXISTS');
        } else if (error.isInvalidRequest()) {
          throw new AuthXeroError('Invalid registration data', 400, 'VALIDATION_ERROR');
        }
      }
      throw new AuthXeroError('Registration failed', 500, 'INTERNAL_SERVER_ERROR');
    } finally {
      console.timeEnd(`signup-${requestId}`);
      console.groupEnd();
    }
  }
  
  async verifyEmail(code: string, token: string): Promise<EmailVerificationResponse> {
    try {
      return await this.makeRequest<EmailVerificationResponse>(ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
    } catch (error) {
      if (error instanceof AuthXeroError) {
        if (error.isInvalidRequest()) {
          throw new AuthXeroError('Invalid verification code', 400, 'INVALID_CODE');
        } else if (error.isRateLimited()) {
          throw new AuthXeroError('Too many verification attempts', 429, 'TOO_MANY_ATTEMPTS');
        }
      }
      throw new AuthXeroError('Verification failed', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 
  async resendVerification(token: string): Promise<EmailVerificationResponse> {
    try {
      return await this.makeRequest<EmailVerificationResponse>(ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      if (error instanceof AuthXeroError && error.isRateLimited()) {
        throw new AuthXeroError('Please wait before requesting another code', 429, 'RATE_LIMIT_EXCEEDED');
      }
      throw new AuthXeroError('Failed to resend verification', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 
  async verifySession(token: string): Promise<AuthXeroUser> {
    try {
      return await this.makeRequest<AuthXeroUser>(ENDPOINTS.ME, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      if (error instanceof AuthXeroError && error.isUnauthorized()) {
        throw new AuthXeroError('Session expired', 401, 'SESSION_EXPIRED');
      }
      throw new AuthXeroError('Session verification failed', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      return await this.makeRequest<TokenResponse>(ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'X-Refresh-Token': refreshToken
        }
      });
    } catch (error) {
      if (error instanceof AuthXeroError && error.isUnauthorized()) {
        throw new AuthXeroError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
      }
      throw new AuthXeroError('Token refresh failed', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 
  async logout(token: string): Promise<void> {
    try {
      await this.makeRequest<void>(ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      throw new AuthXeroError('Logout failed', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
 }
 
 export class AuthXeroError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'AuthXeroError';
    Object.setPrototypeOf(this, AuthXeroError.prototype);
  }
 
  isUnauthorized(): boolean { return this.status === 401; }
  isForbidden(): boolean { return this.status === 403; }
  isNotFound(): boolean { return this.status === 404; } 
  isConflict(): boolean { return this.status === 409; }
  isInvalidRequest(): boolean { return this.status === 400; }
  isRateLimited(): boolean { return this.status === 429; }
  isServerError(): boolean { return this.status >= 500; }
 }
 