import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  X,
  ChevronRight,
} from 'lucide-react';
import { SETUP_OPTIONS } from '../constants';
import type { SetupOption, MousePosition } from '../types';
import { FAQ_ITEMS } from '../faqData';

interface PlatformStepProps {
  mousePositions: Record<string, MousePosition>;
  setMousePositions: React.Dispatch<
    React.SetStateAction<Record<string, MousePosition>>
  >;
  selectedOption: SetupOption['id'] | null;
  onSelect: (optionId: SetupOption['id']) => void;
  onBack: () => void;
  previousDomain: string;
}

export const PlatformStep: React.FC<PlatformStepProps> = ({
  mousePositions,
  setMousePositions,
  selectedOption,
  onSelect,
  onBack,
  previousDomain,
}) => {
  const [isHovering, setIsHovering] = useState<Record<string, boolean>>({});
  const [showFAQ, setShowFAQ] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const handleMouseMove = (
    optionId: SetupOption['id'],
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePositions((prev) => ({
      ...prev,
      [optionId]: {
        x: (e.clientX ?? 0) - (rect.left ?? 0),
        y: (e.clientY ?? 0) - (rect.top ?? 0),
      },
    }));
    setIsHovering((prev) => ({ ...prev, [optionId]: true }));
  };

  const handleMouseLeave = (optionId: SetupOption['id']) => {
    setTimeout(() => {
      setIsHovering((prev) => ({ ...prev, [optionId]: false }));
      setMousePositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[optionId];
        return newPositions;
      });
    }, 300);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filteredFAQs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-64px)] w-full">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={hasLoaded ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="w-full flex flex-col space-y-8 mt-[calc(25vh-64px)]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center justify-between mb-8"
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="truncate max-w-[200px] text-zinc-400 hover:text-white transition-colors">
                {previousDomain}
              </span>
            </button>

            <div className="text-center flex-1">
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-white"
              >
                Choose Your Platform
              </motion.h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.6 }}
                className="text-zinc-400"
              >
                Select the type of application you&apos;re building
              </motion.p>
            </div>
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Help</span>
              <motion.div
                animate={{ rotate: showFAQ ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </button>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {SETUP_OPTIONS.map((option, index) => {
              const Icon = option.icon;
              const mousePosition = mousePositions[option.id];
              const isHovered = isHovering[option.id];

              return (
                <motion.button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  onMouseMove={(e) => handleMouseMove(option.id, e)}
                  onMouseLeave={() => handleMouseLeave(option.id)}
                  whileHover={{ translateY: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: 0.2 * (index + 1) }}
                  className={`relative overflow-hidden p-6 border rounded-xl ${
                    selectedOption === option.id
                      ? 'border-white bg-zinc-900/50'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedOption === option.id
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 group-hover:bg-zinc-700'
                      } transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-lg">{option.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        {option.description}
                      </p>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform ${
                        selectedOption === option.id ? 'translate-x-1' : ''
                      }`}
                    />
                  </div>

                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: `
                          radial-gradient(400px circle at ${mousePosition?.x ?? 0}px ${
                            mousePosition?.y ?? 0
                          }px, rgba(59, 130, 246, 0.1), transparent 40%),
                          radial-gradient(800px circle at ${mousePosition?.x ?? 0}px ${
                            mousePosition?.y ?? 0
                          }px, rgba(59, 130, 246, 0.05), transparent 40%)
                        `,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFAQ && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-16 h-[calc(100vh-64px)] bg-zinc-900 border-l border-zinc-800 overflow-y-auto z-40 w-full sm:w-[480px]"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
              className="p-6 space-y-4"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center justify-between"
              >
                <h2 className="text-xl font-bold text-white">
                  Which do you choose
                </h2>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-m font-bold text-center text-white"
              >
                Type your language, library or framework in search to narrow
                down options
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ delay: 0.2 * (index + 1) }}
                    className="border border-zinc-800 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                    >
                      <h3 className="font-semibold text-white">
                        {faq.question}
                      </h3>
                      {expandedFAQs.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                    {expandedFAQs.includes(index) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 text-zinc-400">{faq.answer}</div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlatformStep;
