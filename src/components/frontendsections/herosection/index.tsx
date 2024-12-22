'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronDown } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import ComplianceSection from './ComplianceSection';
import { BusinessContexts, businessContexts } from './data';
import AnimatedBackground from './AnimatedBackground';
import ShimmerButton from '../../ShimmerButton';
import BubbleTextSubtitle from '../../BubbleTextSubtitle';

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [activeContext, setActiveContext] =
    useState<keyof BusinessContexts>('enterprise');
  const [isPaused, setIsPaused] = useState(false);
  const [isTerminalComplete, setIsTerminalComplete] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPaused && isTerminalComplete) {
      const timer = setTimeout(() => {
        setActiveContext((prev) => {
          const contexts = Object.keys(businessContexts) as Array<
            keyof BusinessContexts
          >;
          const currentIndex = contexts.indexOf(prev);
          return contexts[(currentIndex + 1) % contexts.length];
        });
        setIsTerminalComplete(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPaused, isTerminalComplete]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setIsContextMenuOpen(false);
  }, []);

  const handleTerminalComplete = useCallback(() => {
    setIsTerminalComplete(true);
  }, []);

  const ContextIcon = businessContexts[activeContext].icon;

  const toggleContextMenu = () => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const selectContext = (key: keyof BusinessContexts) => {
    setActiveContext(key);
    setIsContextMenuOpen(false);
  };

  if (!mounted) return null;

  const complianceVariants = {
    initial: {
      opacity: 0,
      y: -20, // Start slightly above
      scale: 0.95, // Slight shrink for a premium feel
      filter: 'blur(6px)', // Add a subtle blur effect
    },
    animate: {
      opacity: 1,
      y: 0, // Settle into position
      scale: 1, // Grow to full size
      filter: 'blur(0px)', // Clear the blur
      transition: {
        duration: 0.8, // Smooth transition duration
        ease: [0.25, 0.8, 0.25, 1], // Premium cubic-bezier easing
      },
    },
    exit: {
      opacity: 0,
      y: -10, // Slight upward motion on exit
      scale: 0.95, // Shrink slightly for exit
      filter: 'blur(4px)', // Reintroduce blur
      transition: {
        duration: 0.6,
        ease: 'easeInOut', // Smooth exit
      },
    },
  };

  const descriptionVariants = {
    initial: {
      opacity: 0,
      y: 20, // Start slightly below its final position
    },
    animate: {
      opacity: 1,
      y: 0, // Move into position
      transition: {
        duration: 0.8, // Slightly longer for readability
        ease: 'easeOut',
        delay: 1.8, // Adjust delay to start after the subtitle finishes
      },
    },
  };

  const tabItemVariants = {
    initial: {
      opacity: 0,
      y: -20, // Start slightly above
    },
    animate: {
      opacity: 1,
      y: 0, // Slide into position
      transition: {
        duration: 0.6, // Smooth entry
        ease: 'easeOut',
      },
    },
  };

  const finalButtonVariants = {
    initial: {
      opacity: 0,
      y: 20, // Starts slightly below its final position
    },
    animate: {
      opacity: 1,
      y: 0, // Slides up into position
      transition: {
        duration: 0.6, // Smooth transition
        ease: 'easeOut',
        delay: 3.2, // Delayed start after the first button animation
      },
    },
  };
  const subtitleVariants = {
    initial: {
      opacity: 0,
      y: 20, // Start slightly below
    },
    animate: {
      opacity: 1,
      y: 0, // Slide up into position
      transition: {
        duration: 0.8, // Smooth animation duration
        ease: 'easeOut', // Ease out for smooth motion
        delay: 1.2, // Delay to match when the title finishes
      },
    },
  };

  const terminalVariants = {
    initial: {
      opacity: 0,
      scale: 0.95, // Slightly shrink at the start
      filter: 'blur(8px)', // Start with a blur effect
    },
    animate: {
      opacity: 1,
      scale: 1, // Grow to full size
      filter: 'blur(0px)', // Remove blur
      transition: {
        duration: 0.8, // Smooth and elegant timing
        ease: [0.25, 0.8, 0.25, 1], // Custom cubic bezier for a premium feel
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95, // Shrink slightly on exit
      filter: 'blur(4px)', // Reapply subtle blur on exit
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.6 },
    },
  };
  const itemVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)', // Start with a blur effect
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)', // Transition to no blur
      transition: {
        duration: 0.6, // Animation duration for each letter
        ease: 'easeOut',
        staggerChildren: 0.05, // Add a delay between letters
      },
    },
  };

  const dropdownVariants = {
    initial: { opacity: 0, y: -8, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const shimmerButtonVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 2.4,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gray-950/80 overflow-hidden overscroll-none pt-16 sm:pt-0"
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero Section"
    >
      {/* Background remains the same */}
      <motion.div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative mx-auto px-2 sm:px-6 lg:px-8 2xl:px-16 py-8 sm:py-12 lg:py-16 2xl:py-24 sm:max-w-2xl md:max-w-3xl lg:max-w-7xl 2xl:max-w-[2000px]"
      >
        <div className="hidden md:flex justify-center gap-4 mb-12">
          {Object.entries(businessContexts).map(([key]) => {
            const Icon = businessContexts[key as keyof BusinessContexts].icon;
            const isActive = activeContext === key;
            return (
              <motion.button
                key={key}
                onClick={() => selectContext(key as keyof BusinessContexts)}
                variants={tabItemVariants} // Apply the animation to each tab
                className={`flex items-center gap-3 px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm text-base ${
                  isActive
                    ? 'bg-gray-800 text-white border border-orange-500/10'
                    : 'bg-gray-900/90 text-gray-400 hover:bg-gray-800/90 hover:text-white border border-gray-800'
                }`}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: isActive ? '' : 'rgb(31 41 55 / 0.9)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="h-5 w-5">
                  <Icon />
                </span>
                <span className="font-medium whitespace-nowrap">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </motion.button>
            );
          })}
        </div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeContext}`}
              variants={containerVariants}
              className="bg-gray-950/95 rounded-2xl p-6 h-full"
            >
              <div className="relative z-[2] space-y-6 sm:space-y-8 h-full flex flex-col">
                <motion.div
                  className="p-2 sm:p-3 bg-gray-800 rounded-xl inline-flex md:cursor-default cursor-pointer relative group w-auto max-w-[100px] md:max-w-[70px]"
                  whileHover={{ scale: 1.05 }}
                  onClick={toggleContextMenu}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                      <ContextIcon />
                    </div>
                    <motion.div
                      className="md:hidden"
                      animate={{ rotate: isContextMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'anticipate' }}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isContextMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute top-full left-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden md:hidden z-50"
                      >
                        {Object.entries(businessContexts).map(([key]) => {
                          const Icon =
                            businessContexts[key as keyof BusinessContexts]
                              .icon;
                          const isActive = activeContext === key;
                          return (
                            <motion.button
                              key={key}
                              onClick={() =>
                                selectContext(key as keyof BusinessContexts)
                              }
                              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
                                isActive
                                  ? 'bg-gray-700/80 text-white'
                                  : 'text-gray-300 hover:bg-gray-700/50'
                              } transition-colors duration-200`}
                              whileHover={{
                                backgroundColor: isActive
                                  ? 'rgb(55 65 81 / 0.8)'
                                  : 'rgb(55 65 81 / 0.5)',
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="h-5 w-5">
                                <Icon />
                              </span>
                              <span className="text-base">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.h1
                  variants={{
                    initial: {}, // No parent animation
                    animate: { transition: { staggerChildren: 0.05 } }, // Stagger words
                  }}
                  initial="initial"
                  animate="animate"
                  className="text-3xl sm:text-4xl lg:text-6xl 2xl:text-7xl font-light text-white leading-[1.1] sm:leading-tight tracking-tight"
                >
                  {businessContexts[activeContext].title
                    .split(' ')
                    .map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="inline-block whitespace-nowrap mr-2"
                      >
                        {/* Wrap each word in a container */}
                        {word.split('').map((letter, letterIndex) => (
                          <motion.span
                            key={letterIndex}
                            className="inline-block"
                            variants={{
                              initial: {
                                opacity: 0,
                                y: 20,
                                filter: 'blur(8px)',
                              },
                              animate: {
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                                transition: { duration: 0.4, ease: 'easeOut' },
                              },
                            }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </span>
                    ))}
                </motion.h1>

                <div className="lg:max-w-[85%]">
                  <motion.div
                    variants={subtitleVariants} // Use the subtitleVariants
                    initial="initial"
                    animate="animate"
                    className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-gray-400 font-light"
                  >
                    <BubbleTextSubtitle
                      text={businessContexts[activeContext]?.subtitle || ''}
                    />
                  </motion.div>
                </div>

                <div className="lg:max-w-[85%]">
                  <motion.p
                    variants={descriptionVariants}
                    initial="initial"
                    animate="animate"
                    className="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-gray-400 leading-relaxed"
                  >
                    {businessContexts[activeContext].description}
                  </motion.p>
                </div>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col xs:flex-row gap-3 sm:gap-4 mt-auto"
                >
                  <div className="lg:max-w-[85%] w-full">
                    <motion.div
                      variants={shimmerButtonVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <ShimmerButton href="/signin" text="Get Started" />
                    </motion.div>

                    <motion.button
                      variants={finalButtonVariants}
                      initial="initial"
                      animate="animate"
                      className="group px-8 py-3.5 bg-gray-900/20 w-full backdrop-blur-sm text-gray-400/70 rounded-xl border border-gray-800/50 hover:bg-gray-800/60 hover:text-white transition-colors text-base whitespace-nowrap"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Documentation
                        <Code className="h-5 w-5" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col gap-6 sm:gap-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`compliance-${activeContext}`} // Unique key for context changes
                variants={complianceVariants} // Apply the defined animation
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full" // Ensure it adapts to its container
              >
                <ComplianceSection
                  standards={businessContexts[activeContext].compliance}
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`terminal-${activeContext}`} // Ensure unique key per context
                variants={terminalVariants} // Apply fade and slide animation
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TerminalWindow
                  messages={businessContexts[activeContext].terminalMessages}
                  onComplete={handleTerminalComplete}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
      <div
        className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black/95 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};

export default HeroSection;
