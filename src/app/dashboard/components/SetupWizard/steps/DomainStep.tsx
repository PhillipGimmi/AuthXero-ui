import React, { useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

interface DomainStepProps {
  readonly initialValue?: string;
  readonly onProceed: (domain: string) => void;
}

export const DomainStep: React.FC<DomainStepProps> = ({
  initialValue = '',
  onProceed,
}) => {
  const [domain, setDomain] = useState<string>(initialValue);
  const [showError, setShowError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const turn = useMotionValue(0);
  const shimmerTurn = useMotionValue(0);
  const degrees = useTransform(turn, (latest) =>
    Math.round((latest * 360) % 360),
  );
  const shimmerDegrees = useTransform(shimmerTurn, (latest) =>
    Math.round((latest * 360) % 360),
  );

  useEffect(() => {
    const animation = animate(turn, 1, {
      ease: 'linear',
      duration: 5,
      repeat: Infinity,
    });

    const shimmerAnimation = animate(shimmerTurn, -1, {
      ease: 'linear',
      duration: 5,
      repeat: Infinity,
    });

    return () => {
      animation.stop();
      shimmerAnimation.stop();
    };
  }, [turn, shimmerTurn]);

  const getRightEdgeLight = (deg: number) => {
    const START_ANGLE = 373;
    const END_ANGLE = 73;

    let normalizedDeg = deg;
    if (deg < END_ANGLE) {
      normalizedDeg = deg + 360;
    }

    if (normalizedDeg < START_ANGLE && normalizedDeg > END_ANGLE) {
      return 0;
    }

    const TOTAL_ARC = 360 - START_ANGLE + END_ANGLE;
    let progress = 0;

    if (normalizedDeg >= START_ANGLE) {
      progress = (normalizedDeg - START_ANGLE) / TOTAL_ARC;
    } else {
      progress = (normalizedDeg + (360 - START_ANGLE)) / TOTAL_ARC;
    }

    return 1 - progress;
  };

  const getLeftShimmer = (deg: number) => {
    const START_ANGLE = 323;
    const END_ANGLE = 73;

    let normalizedDeg = deg;
    if (deg < END_ANGLE) {
      normalizedDeg = deg + 360;
    }

    if (normalizedDeg < START_ANGLE && normalizedDeg > END_ANGLE) {
      return 0;
    }

    const TOTAL_ARC = 360 - START_ANGLE + END_ANGLE;
    let progress = 0;

    if (normalizedDeg >= START_ANGLE) {
      progress = (normalizedDeg - START_ANGLE) / TOTAL_ARC;
    } else {
      progress = (normalizedDeg + (360 - START_ANGLE)) / TOTAL_ARC;
    }

    return 1 - progress;
  };

  const buttonLight = useTransform(degrees, (latest) =>
    getRightEdgeLight(latest),
  );
  const shimmerLight = useTransform(shimmerDegrees, (latest) =>
    getLeftShimmer(latest),
  );

  const isValidDomain = (input: string): boolean => {
    const trimmedInput = input.trim();
    const pattern =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return pattern.test(trimmedInput);
  };

  const getBorderColor = () => {
    if (domain === '') return '#ffffff';
    return isValidDomain(domain) ? '#22c55e' : '#ef4444';
};

  const borderGradient = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 0deg, ${getBorderColor()} 60deg, ${getBorderColor()} 120deg, transparent 120deg)`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDomain = domain.trim();

    if (isValidDomain(trimmedDomain)) {
      setShowError(false);
      onProceed(trimmedDomain);
    } else {
      setShowError(true);
    }
  };

  const handleInputChange = (value: string) => {
    setDomain(value);
    if (showError) setShowError(false);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const getActiveDot = () => {
    if (domain === '') return 'white';
    return isValidDomain(domain) ? 'valid' : 'invalid';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold text-white dark:text-black mb-2 text-center"
      >
        Secure Your Application
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-zinc-400 dark:text-gray-600 text-center"
      >
        Enter your domain to get started
      </motion.p>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4"
      >
        <div className="relative group">
          <motion.div
            className="absolute -inset-[2px] rounded-lg opacity-75 blur-lg transition-opacity group-hover:opacity-100"
            style={{
              background: borderGradient,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] rounded-lg"
            style={{
              background: borderGradient,
              opacity: 0.8,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] rounded-lg mix-blend-soft-light"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
          <div className="absolute inset-[1px] rounded-lg bg-zinc-900/90 dark:bg-gray-100/90 backdrop-blur-sm" />

          <input
            type="text"
            value={domain}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="your-domain.com"
            className="relative w-full px-4 py-3 rounded-lg bg-transparent border-transparent focus:outline-none transition-all duration-200 dark:text-black"
          />

          <div
            className="absolute top-[1px] bottom-[1px] right-[1px] overflow-hidden rounded-r-lg w-[52px] border-transparent"
            style={{
              background:
                'linear-gradient(to right, rgba(24, 24, 27, 0) 0%, rgba(24, 24, 27, 1) 100%)',
            }}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <div className="absolute inset-0 -left-[1px] bg-zinc-900 dark:bg-gray-100 rounded-md overflow-hidden">
              <motion.div
                className="absolute -left-[1px] top-[3px] bottom-[3px] w-[1px]"
                style={{
                  background: useMotionTemplate`linear-gradient(to bottom, ${getBorderColor()}00, ${getBorderColor()}ff, ${getBorderColor()}00)`,
                  opacity: shimmerLight,
                }}
              />
            </div>

            <button
              type="submit"
              className="relative z-0 flex items-center overflow-hidden whitespace-nowrap rounded-md border-[1px] 
            border-zinc-900 dark:border-gray-300 px-4 py-1.5 font-medium text-neutral-300 dark:text-gray-700 transition-all duration-300
            before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5]
            before:rounded-[100%] before:transition-transform before:duration-1000
            before:content-['']
            before:bg-white dark:before:bg-black hover:before:translate-y-[0%]
            hover:scale-105 hover:border-white dark:hover:border-black hover:text-neutral-900 dark:hover:text-white
            active:scale-100"
            >
              <motion.div
                className="absolute -right-[1px] top-0 bottom-0 w-[1px]"
                style={{
                  background: useMotionTemplate`linear-gradient(to bottom, ${getBorderColor()}00, ${getBorderColor()}ff, ${getBorderColor()}00)`,
                  opacity: buttonLight,
                }}
              />
              <span className="relative z-10">Next</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isInputFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900/50 dark:bg-white/50 rounded-lg p-3 border border-zinc-800/50 dark:border-gray-300/50 backdrop-blur-sm"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'white'
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-white/20 dark:bg-gray-200/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'white'
                        ? 'text-white dark:text-gray-800'
                        : 'text-white/40 dark:text-gray-400'
                    }`}
                  >
                    Not started
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'invalid'
                        ? 'bg-red-500 dark:bg-red-600'
                        : 'bg-red-500/20 dark:bg-red-200/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'invalid'
                        ? 'text-red-500 dark:text-red-600'
                        : 'text-red-500/40 dark:text-red-200/40'
                    }`}
                  >
                    Invalid format
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'valid'
                        ? 'bg-green-500 dark:bg-green-600'
                        : 'bg-green-500/20 dark:bg-green-200/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'valid'
                        ? 'text-green-500 dark:text-green-600'
                        : 'text-green-500/40 dark:text-green-200/40'
                    }`}
                  >
                    Valid domain
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 dark:text-red-600 text-sm"
          >
            Please enter a valid domain
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
};

export default DomainStep;
