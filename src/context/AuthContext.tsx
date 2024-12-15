'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthXeroClient } from '@/lib/authxero';
import type {
  AuthXeroUser,
  AuthXeroError,
  AuthCredentials,
  SignUpCredentials,
  AuthResponse,
  ErrorWithStatus,
  EmailVerificationResponse,
  DeviceInfo,
  TokenPair,
  AuthState,
} from '@/types/auth';
import LoadingOverlay from '@/components/FullScreenLoader';

const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080',
  ENDPOINTS: {
    VERIFY_EMAIL: '/api/auth/verify-email',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout'
  }
} as const;

const TOKEN_CONFIG = {
  AUTH_TOKEN_NAME: 'authxero_token',
  REFRESH_TOKEN_NAME: 'authxero_refresh_token',
  EXPIRY: 86400,
  REFRESH_BUFFER: 300,
  COOKIE_OPTIONS: {
    path: '/',
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 86400
  }
} as const;

const ANIMATION_DURATION = 100;

interface AuthContextType {
  user: AuthXeroUser | null;
  loading: boolean;
  error: AuthXeroError | null;
  isVerified: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (code: string) => Promise<EmailVerificationResponse>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

const createTokenManager = () => ({
  setTokens: (token: string, refreshToken: string) => {
    document.cookie = `${TOKEN_CONFIG.AUTH_TOKEN_NAME}=${token}; path=/; max-age=${TOKEN_CONFIG.EXPIRY}; secure; samesite=lax`;
    document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN_NAME}=${refreshToken}; path=/; max-age=${TOKEN_CONFIG.EXPIRY * 2}; secure; samesite=lax`;
  },
  getTokens: (): TokenPair => ({
    token: document.cookie.split('; ').find(row => row.startsWith(`${TOKEN_CONFIG.AUTH_TOKEN_NAME}=`))?.split('=')[1] ?? null,
    refreshToken: document.cookie.split('; ').find(row => row.startsWith(`${TOKEN_CONFIG.REFRESH_TOKEN_NAME}=`))?.split('=')[1] ?? null
  }),
  removeTokens: () => {
    document.cookie = `${TOKEN_CONFIG.AUTH_TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`;
    document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`;
  }
});

const getDeviceInfo = (): DeviceInfo => ({
  userAgent: window.navigator.userAgent,
  screen: `${window.screen.width}x${window.screen.height}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: window.navigator.language,
  platform: /Windows|Mac|Linux|Android|iOS/.exec(window.navigator.userAgent)?.[0] ?? 'Unknown'
});


export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isLoggingOut: false,
    error: null,
    isVerified: false
  });

  const tokenManager = useMemo(() => createTokenManager(), []);
  const client = useMemo(() => new AuthXeroClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const handleError = useCallback((err: unknown): AuthXeroError => {
    const error = {
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
      status: err instanceof Error && 'status' in err ? (err as ErrorWithStatus).status ?? 500 : 500,
      timestamp: new Date().toISOString(),
      details: err instanceof Error ? err.stack : undefined
    };
    setAuthState(prev => ({ ...prev, error }));
    return error;
  }, []);

  const handleSessionTimeout = useCallback(() => {
    tokenManager.removeTokens();
    setAuthState(prev => ({
      ...prev,
      user: null,
      isVerified: false
    }));
    router.push('/signin?reason=session_timeout');
  }, [tokenManager, router]);

  const refreshTokenWithRetry = useCallback(async (retryCount = 3): Promise<void> => {
    for (let i = 0; i < retryCount; i++) {
      try {
        const { refreshToken } = tokenManager.getTokens();
        if (!refreshToken) {
          handleSessionTimeout();
          return;
        }
        const response = await client.refreshToken(refreshToken);
        tokenManager.setTokens(response.token, response.refreshToken);
        return;
      } catch (err) {
        if (i === retryCount - 1) {
          handleSessionTimeout();
          handleError(err);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }, [client, tokenManager, handleSessionTimeout, handleError]);

  useEffect(() => {
    let isSubscribed = true;
    let refreshInterval: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const { token } = tokenManager.getTokens();
        if (!token) {
          if (isSubscribed) {
            setAuthState(prev => ({
              ...prev,
              user: null,
              isVerified: false,
              loading: false
            }));
          }
          return;
        }

        const currentUser = await client.verifySession(token);

        if (!isSubscribed) return;

        if (currentUser) {
          setAuthState(prev => ({
            ...prev,
            user: currentUser,
            isVerified: currentUser.email_verified,
            loading: false
          }));
          refreshInterval = setInterval(() => void refreshTokenWithRetry(), 
            (TOKEN_CONFIG.EXPIRY - TOKEN_CONFIG.REFRESH_BUFFER) * 1000
          );
        } else {
          handleSessionTimeout();
        }
      } catch (err) {
        if (isSubscribed) {
          handleSessionTimeout();
          handleError(err);
        }
      } finally {
        if (isSubscribed) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    void checkSession();

    return () => {
      isSubscribed = false;
      clearInterval(refreshInterval);
    };
  }, [client, tokenManager, handleSessionTimeout, handleError, refreshTokenWithRetry]);

  const login = useCallback(async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      clearError();
      
      const response = await client.login(credentials);
      
      if (!response.token || !response.refreshToken || !response.user) {
        throw new Error('Invalid response from server');
      }
  
      const normalizedUser = {
        ...response.user,
        email_verified: response.user.email_verified
      };
      
      if (!normalizedUser.email_verified) {
        tokenManager.setTokens(response.token, response.refreshToken);
        setAuthState(prev => ({
          ...prev,
          user: normalizedUser,
          isVerified: false,
        }));

        return {
          success: true,
          requiresVerification: true,
          email: credentials.email,
          token: response.token,
          refreshToken: response.refreshToken,
          user: normalizedUser
        };
      }
      
      // Only set tokens and redirect if verified
      tokenManager.setTokens(response.token, response.refreshToken);
      setAuthState(prev => ({
        ...prev,
        user: normalizedUser,
        isVerified: normalizedUser.email_verified,
      }));
      
      const returnTo = searchParams.get('returnTo');
      router.push(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
  
      return {
        success: true,
        user: normalizedUser,
        token: response.token,
        refreshToken: response.refreshToken,
      };
    } catch (err) {
      const error = handleError(err);
      return { success: false, error: error.message };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
}, [client, clearError, tokenManager, router, searchParams, handleError]);

  const signup = useCallback(async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      clearError();
  
      const response = await client.signup(credentials);
  
      if (response.user && response.token && response.refreshToken) {
        const normalizedUser = {
          ...response.user,
          email_verified: response.user.email_verified
        };
  
        tokenManager.setTokens(response.token, response.refreshToken);
        setAuthState(prev => ({ ...prev, user: normalizedUser }));
  
        return {
          success: true,
          message: 'Please check your email for verification instructions.',
          requiresVerification: true,
          email: credentials.email,
          token: response.token,
          refreshToken: response.refreshToken,
        };
      }
  
      throw new Error('Invalid response from server');
    } catch (err) {
      const error = handleError(err);
      return { success: false, error: error.message };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [client, clearError, handleError, tokenManager]);

  const verifyEmail = useCallback(async (code: string): Promise<EmailVerificationResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      clearError();

      const { token } = tokenManager.getTokens();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_EMAIL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          timestamp: new Date().toISOString(),
          client: 'web',
          deviceInfo: getDeviceInfo()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setAuthState(prev => ({ ...prev, isVerified: true }));
      
      return {
        success: true,
        message: data.message,
        status: data.status || 'success'
      };
    } catch (err) {
      const error = handleError(err);
      return {
        success: false,
        error: error.message,
        message: error.message,
        status: 'error'
      };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [clearError, tokenManager, handleError]);

  const performLogout = useCallback(async (): Promise<void> => {
    try {
      const { token } = tokenManager.getTokens();
      if (token) {
        await client.logout(token);
      }
      tokenManager.removeTokens();
      setAuthState(prev => ({
        ...prev,
        user: null,
        isVerified: false,
        error: null
      }));
    } catch (err) {
      handleError(err);
    }
  }, [client, tokenManager, handleError]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoggingOut: true }));
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
      await performLogout();
      router.push('/signin?reason=logout');
    } catch (err) {
      handleError(err);
      setAuthState(prev => ({ ...prev, isLoggingOut: false }));
      throw err;
    }
  }, [performLogout, handleError, router]);

  const contextValue = useMemo(
    () => ({
      user: authState.user,
      loading: authState.loading,
      error: authState.error,
      isVerified: authState.isVerified,
      login,
      signup,
      logout,
      clearError,
      verifyEmail,
      refreshToken: refreshTokenWithRetry,
    }),
    [authState, login, signup, logout, clearError, verifyEmail, refreshTokenWithRetry]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {authState.isLoggingOut && <LoadingOverlay />}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;