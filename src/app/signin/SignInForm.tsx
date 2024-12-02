'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import type { AuthMode, ValidationResult, AuthResponse, SignUpCredentials, AuthCredentials } from '@/types/auth';
import ShimmerButton from '@/components/ShimmerButton';

interface SignInFormProps {
  mode: AuthMode;
}

const formVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const containerVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const inputVariants = {
  initial: {
    opacity: 0,
    x: -20,
    y: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

const buttonContainerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.8, // Delay after inputs
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  }
};

const buttonVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

const textVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 1.2, // Delay after button
    }
  }
};

const SignInForm: React.FC<SignInFormProps> = ({ mode }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showVerificationField, setShowVerificationField] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { login, signup, verifyEmail } = useAuth();

  const validateEmail = (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Please enter your email.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid email address.',
    };
  };

  const validatePassword = (password: string, isSignup: boolean): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Please enter your password.' };
    }
    if (isSignup && password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long.' };
    }
    return { isValid: true };
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match.' };
    }
    return { isValid: true };
  };

  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error as string);
    }

    const passwordValidation = validatePassword(password, mode === 'signup');
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error as string);
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
      if (!confirmPasswordValidation.isValid) {
        throw new Error(confirmPasswordValidation.error as string);
      }
    }
  }, [email, password, confirmPassword, name, mode]);

  const handleAuthentication = async (): Promise<AuthResponse> => {
    if (mode === 'signin') {
      const loginPayload: AuthCredentials = {
        email,
        password
      };
      return await login(loginPayload);
    }

    const signupPayload: SignUpCredentials = {
      name,
      email,
      password,
      confirmPassword
    };
    return await signup(signupPayload);
  };

  const handleVerifyCode = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await verifyEmail(verificationCode);

      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.error ?? 'Verification failed.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    try {
      setError('');
      setIsLoading(true);

      if (showVerificationField) {
        await handleVerifyCode();
      } else {
        validateForm();
        const response = await handleAuthentication();

        if (!response.success) {
          throw new Error(response.error ?? 'Authentication failed');
        }

        if (response.requiresVerification) {
          setShowVerificationField(true);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = (): string => {
    if (isLoading) {
      return 'Processing...';
    }
    if (showVerificationField) {
      return 'Verify Code';
    }
    return mode === 'signin' ? 'Sign in' : 'Create account';
  };

  return (
    <motion.form
      variants={formVariants}
      initial="initial"
      animate="animate"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
          >
            <p className="text-red-500 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showVerificationField && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {mode === 'signup' && (
            <motion.div variants={inputVariants} className="mb-3">
              <label htmlFor="name-input" className="mb-1.5 block text-zinc-400">Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                autoComplete="name"
                disabled={isLoading}
                required
              />
            </motion.div>
          )}

          <motion.div variants={inputVariants} className="mb-3">
            <label htmlFor="email-input" className="mb-1.5 block text-zinc-400">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="your.email@example.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete={mode === 'signup' ? 'username' : 'email'}
              disabled={isLoading}
              required
            />
          </motion.div>

          <motion.div variants={inputVariants} className="mb-6">
            <label htmlFor="password-input" className="mb-1.5 block text-zinc-400">Password</label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              disabled={isLoading}
              required
              minLength={8}
            />
          </motion.div>

          {mode === 'signup' && (
            <motion.div variants={inputVariants} className="mb-6">
              <label htmlFor="confirm-password-input" className="mb-1.5 block text-zinc-400">
                Confirm Password
              </label>
              <input
                id="confirm-password-input"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
                minLength={8}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {showVerificationField && (
        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          className="mb-6"
        >
          <label htmlFor="verification-code-input" className="mb-1.5 block text-zinc-400">
            Verification Code
          </label>
          <input
            id="verification-code-input"
            type="text"
            placeholder="Enter your code"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            value={verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
            autoComplete="one-time-code"
            disabled={isLoading}
            required
          />
        </motion.div>
      )}

      <motion.div
        variants={buttonContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={buttonVariants}>
          <div className="mb-[-10px]">
          <ShimmerButton
            href="#"
            text={getButtonText()}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          />
          </div>
        </motion.div>
      </motion.div>

      <motion.p 
        variants={textVariants}
        initial="initial"
        animate="animate"
        className="text-xs text-zinc-400"
      >
        By {mode === 'signin' ? 'signing in' : 'signing up'}, you agree to our{' '}
        <Link
          href="/terms"
          className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-100 rounded-sm"
        >
          Terms &amp; Conditions
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-100 rounded-sm"
        >
          Privacy Policy
        </Link>
      </motion.p>
    </motion.form>
  );
};

export default SignInForm;