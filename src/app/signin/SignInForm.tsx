'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const inputVariants = {
  initial: { opacity: 0, x: -20, y: 20 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const buttonContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.8,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 1.2,
    },
  },
};

const SignInForm: React.FC<SignInFormProps> = ({ mode }) => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    verificationCode: '',
    showVerificationField: false,
    error: '',
    isLoading: false,
    touched: {
      email: false,
      password: false,
      name: false,
      confirmPassword: false,
    },
  });

  const router = useRouter();
  const { login, signup, verifyEmail } = useAuth();

  useEffect(() => {
    console.log('Form mounted with mode:', mode);
    return () => {
      console.log('Form unmounting, cleaning up');
    };
  }, [mode]);

  const validateEmail = useCallback((email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Please enter your email.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid email address.',
    };
  }, []);

  const validatePassword = useCallback((password: string, isSignup: boolean): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Please enter your password.' };
    }
    if (isSignup && password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long.' };
    }
    return { isValid: true };
  }, []);

  const validateConfirmPassword = useCallback(
    (password: string, confirmPassword: string): ValidationResult => {
      if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match.' };
      }
      return { isValid: true };
    },
    []
  );

  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(formState.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error ?? '');
    }

    const passwordValidation = validatePassword(formState.password, mode === 'signup');
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error ?? '');
    }

    if (mode === 'signup') {
      if (!formState.name.trim()) {
        throw new Error('Name is required');
      }
      const confirmPasswordValidation = validateConfirmPassword(
        formState.password,
        formState.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        throw new Error(confirmPasswordValidation.error ?? '');
      }
    }
  }, [formState, mode, validateEmail, validatePassword, validateConfirmPassword]);

  const handleAuthentication = async (): Promise<AuthResponse> => {
    if (mode === 'signin') {
      const loginPayload: AuthCredentials = {
        email: formState.email,
        password: formState.password,
      };
      return await login(loginPayload);
    }

    const signupPayload: SignUpCredentials = {
      name: formState.name,
      email: formState.email,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
    };
    return await signup(signupPayload);
  };

  const handleVerifyCode = async (): Promise<void> => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      const response = await verifyEmail(formState.verificationCode);

      if (response.success) {
        router.push('/dashboard');
      } else {
        setFormState((prev) => ({
          ...prev,
          error: response.error ?? 'Verification failed.',
        }));
      }
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prev) => {
      const updatedState = {
        ...prev,
        [name]: value,
        touched: { ...prev.touched, [name]: true },
      };

      if (name === 'email') {
        const emailValidation = validateEmail(value);
        updatedState.error = emailValidation.isValid ? '' : emailValidation.error ?? '';
      }
      if (name === 'password') {
        const passwordValidation = validatePassword(value, mode === 'signup');
        updatedState.error = passwordValidation.isValid ? '' : passwordValidation.error ?? '';
      }
      if (name === 'confirmPassword') {
        const confirmPasswordValidation = validateConfirmPassword(
          prev.password,
          value
        );
        updatedState.error = confirmPasswordValidation.isValid
          ? ''
          : confirmPasswordValidation.error ?? '';
      }

      return updatedState;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      setFormState((prev) => ({ ...prev, error: '', isLoading: true }));

      if (formState.showVerificationField) {
        await handleVerifyCode();
      } else {
        validateForm();
        const response = await handleAuthentication();

        if (!response.success) {
          setFormState((prev) => ({
            ...prev,
            error: response.error ?? 'Authentication failed. Please try again.',
          }));
          return;
        }

        if (response.requiresVerification) {
          setFormState((prev) => ({ ...prev, showVerificationField: true }));
        } else {
          router.push('/dashboard');
        }
      }
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getButtonText = (): string => {
    if (formState.isLoading) return 'Processing...';
    if (formState.showVerificationField) return 'Verify Code';
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
        {formState.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
          >
            <p className="text-red-500 text-sm">{formState.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!formState.showVerificationField && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {mode === 'signup' && (
            <motion.div variants={inputVariants} className="mb-3">
              <label htmlFor="name" className="mb-1.5 block text-zinc-400">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                value={formState.name}
                onChange={handleInputChange}
                autoComplete="name"
                disabled={formState.isLoading}
                required
              />
            </motion.div>
          )}

          <motion.div variants={inputVariants} className="mb-3">
            <label htmlFor="email" className="mb-1.5 block text-zinc-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              value={formState.email}
              onChange={handleInputChange}
              autoComplete={mode === 'signup' ? 'username' : 'email'}
              disabled={formState.isLoading}
              required
            />
          </motion.div>

          <motion.div variants={inputVariants} className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-zinc-400">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              value={formState.password}
              onChange={handleInputChange}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              disabled={formState.isLoading}
              required
              minLength={8}
            />
          </motion.div>

          {mode === 'signup' && (
            <motion.div variants={inputVariants} className="mb-6">
              <label htmlFor="confirmPassword" className="mb-1.5 block text-zinc-400">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                value={formState.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                disabled={formState.isLoading}
                required
                minLength={8}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {formState.showVerificationField && (
        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          className="mb-6"
        >
          <label htmlFor="verificationCode" className="mb-1.5 block text-zinc-400">
            Verification Code
          </label>
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            placeholder="Enter your code"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-400 text-white ring-1 ring-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            value={formState.verificationCode}
            onChange={handleInputChange}
            autoComplete="one-time-code"
            disabled={formState.isLoading}
            required
          />
        </motion.div>
      )}

      <motion.div variants={buttonContainerVariants} initial="initial" animate="animate">
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
