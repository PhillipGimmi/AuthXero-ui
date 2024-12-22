export interface AuthXeroUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  isConfigured: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthXeroError {
  message: string;
  status: number;
}

export interface ErrorWithStatus extends Error {
  status?: number;
}

export interface AuthErrorResponse {
  status: string;
  message: string;
  error_code?: string;
  status_code?: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  confirmPassword?: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  token_type: string;
  expires_in: number;
}

export interface AuthXeroLoginResponse {
  token: string;
  refreshToken: string;
  user: AuthXeroUser;
  token_type: string;
  expires_in: number;
  success?: boolean;
}

export interface EmailVerificationRequest {
  code: string;
}

export interface EmailVerificationResponse {
  message: string;
  status: string;
  success: boolean;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthXeroUser;
  token?: string;
  refreshToken?: string;
  error?: string;
  message?: string;
  requiresVerification?: boolean;
  email?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AuthContextType {
  user: AuthXeroUser | null;
  loading: boolean;
  error: AuthXeroError | null;
  isVerified: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (code: string) => Promise<EmailVerificationResponse>;
  refreshToken: (retryCount?: number) => Promise<void>;
}

export interface AuthState {
  user: AuthXeroUser | null;
  loading: boolean;
  error: AuthXeroError | null;
  isVerified: boolean;
  isLoggingOut: boolean;
}

export interface DeviceInfo {
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
}

export interface TokenPair {
  token: string | null;
  refreshToken: string | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthMode = 'signin' | 'signup';

export type AuthAction =
  | { type: 'SET_USER'; payload: AuthXeroUser }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AuthXeroError | null }
  | { type: 'SET_VERIFIED'; payload: boolean }
  | { type: 'CLEAR_STATE' };

export function isAuthXeroError(error: unknown): error is AuthXeroError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof (error as AuthXeroError).message === 'string' &&
    typeof (error as AuthXeroError).status === 'number'
  );
}

export function isAuthResponse(response: unknown): response is AuthResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof (response as AuthResponse).success === 'boolean'
  );
}

export function isAuthXeroUser(user: unknown): user is AuthXeroUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'email' in user &&
    'name' in user &&
    'role' in user &&
    'active' in user &&
    'created_at' in user &&
    'updated_at' in user
  );
}
