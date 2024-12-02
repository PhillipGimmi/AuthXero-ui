'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BubbleButton } from './CustomButtons';
import SignInForm from './SignInForm';
import { CornerGrid } from './CornerGrid';
import { Meteors } from '../ui/Meteors';
import { Stars } from '../ui/Stars';

type AuthMode = 'signin' | 'signup';

// Animation variants
const containerVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
};

const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: "blur(10px)",
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
    },
  },
};

const backgroundVariants = {
  initial: { 
    opacity: 0,
    scale: 1.1,
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

const Heading = ({ mode, onToggleMode }: { mode: AuthMode; onToggleMode: () => void }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      initial: { opacity: 0 },
      animate: { 
        opacity: 1, 
        transition: { 
          staggerChildren: 0.08, // Sped up from 0.15
          delayChildren: 0.2,    // Sped up from 0.3
        },
      },
    }}
  >
    <motion.h1 
      variants={fadeInUp}
      className="text-3xl font-bold text-zinc-100 relative hover:scale-[1.02] transition-transform duration-200"
    >
      Logo
    </motion.h1>
    <div className="mb-9 mt-6 space-y-1.5">
      <motion.h2 
        variants={fadeInUp}
        className="text-2xl font-semibold"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }} // Sped up from 0.3
          >
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </motion.span>
        </AnimatePresence>
      </motion.h2>
      <div className="text-zinc-400">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="inline-block"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} // Sped up from 0.3
              className="inline-block"
            >
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </motion.span>

            <motion.button
              onClick={onToggleMode}
              className="ml-3 text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{}}
                  animate={{ transition: { staggerChildren: 0.02 } }} // Sped up from 0.05
                >
                  {(mode === 'signin' ? ['Create', 'one.'] : ['Sign', 'in', 'instead.']).map((word, wordIndex) => (
                    <motion.span 
                      key={wordIndex} 
                      className="inline-block whitespace-nowrap"
                      initial={{}}
                      animate={{ transition: { staggerChildren: 0.02 } }} // Sped up from 0.05
                    >
                      {word.split('').map((letter, letterIndex) => (
                        <motion.span
                          key={letterIndex}
                          className="inline-block"
                          variants={{
                            initial: { opacity: 0, y: 20, filter: "blur(8px)" },
                            animate: {
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                              transition: { duration: 0.25, ease: "easeOut" }, // Sped up from 0.4
                            }
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                      {wordIndex !== (mode === 'signin' ? 1 : 2) && (
                        <span className="inline-block mr-2">{' '}</span>
                      )}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

const SocialOptions = ({ mode }: { mode: AuthMode }) => (
  <motion.div
    variants={{
      initial: { opacity: 0 },
      animate: { 
        opacity: 1, 
        transition: { 
          delayChildren: 0.6, 
          staggerChildren: 0.1,
        },
      },
    }}
    initial="initial"
    animate="animate"
  >
    <motion.div 
      variants={fadeInUp} 
      className="mb-3 flex gap-3"
    >
      <BubbleButton
        onClick={() => (window.location.href = '/api/auth/twitter')}
        className="flex w-full justify-center py-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        aria-label={`${mode === 'signin' ? 'Sign in' : 'Sign up'} with Twitter`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </BubbleButton>
      <BubbleButton
        onClick={() => (window.location.href = '/api/auth/github')}
        className="flex w-full justify-center py-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        aria-label={`${mode === 'signin' ? 'Sign in' : 'Sign up'} with GitHub`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </BubbleButton>
    </motion.div>
    <motion.div variants={fadeInUp}>
      <BubbleButton
        onClick={() => (window.location.href = '/api/auth/sso')}
        className="flex w-full justify-center py-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {mode === 'signin' ? 'Sign in' : 'Sign up'} with SSO
      </BubbleButton>
    </motion.div>
  </motion.div>
);

const Or = () => (
  <motion.div 
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="my-6 flex items-center gap-3"
  >
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="h-[1px] w-full bg-zinc-700 origin-left"
    />
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="text-zinc-400"
    >
      OR
    </motion.span>
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="h-[1px] w-full bg-zinc-700 origin-right"
    />
  </motion.div>
);

const DarkGridAuth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-zinc-200 selection:bg-zinc-600 overflow-hidden bg-zinc-950">
      {/* Background Effects */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0"
      >
        <CornerGrid />
        <Meteors number={20} />
        <Stars number={100} />
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="relative z-10 mx-auto w-full max-w-xl p-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Heading mode={mode} onToggleMode={toggleMode} />
          <SocialOptions mode={mode} />
          <Or />
          <SignInForm mode={mode} />
        </motion.div>
      </AnimatePresence>

      {/* Go Back Button */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 1.4 }}
        className="absolute left-4 top-6 z-10"
      >
        <BubbleButton
          onClick={() => window.history.back()}
          className="text-sm group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <motion.svg
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </motion.svg>
          Go back
        </BubbleButton>
      </motion.div>
    </div>
  );
};

export default DarkGridAuth;