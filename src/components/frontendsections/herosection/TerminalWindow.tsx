'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Minus, Square } from 'lucide-react';
import TerminalLine from './TerminalLine';
import { commands } from './terminaldata';

interface TerminalWindowProps {
  messages: string[];
  onComplete?: () => void;
}

const TerminalWindow = ({ messages, onComplete }: TerminalWindowProps) => {
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  const isPausedRef = useRef(false);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      completedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setVisibleLines(0);
    completedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeoutId = setTimeout(() => {
      const interval = setInterval(() => {
        if (!isPausedRef.current) {
          setVisibleLines((prev) => {
            if (prev < messages.length) {
              return prev + 1;
            }
            if (!completedRef.current) {
              completedRef.current = true;
              Promise.resolve().then(() => onComplete?.());
            }
            clearInterval(interval);
            return prev;
          });
        }
      }, 2000);

      timerRef.current = interval;
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [messages, onComplete]);

  useEffect(() => {
    if (terminalContentRef.current) {
      const { scrollTop } = terminalContentRef.current;
      if (scrollTop < lastScrollPositionRef.current) {
        terminalContentRef.current.scrollTop = lastScrollPositionRef.current;
      }
    }
  }, [commandHistory]);

  useEffect(() => {
    isPausedRef.current = isHovered;
    setIsInteractive(isHovered);
  }, [isHovered]);

  const handleScroll = () => {
    if (terminalContentRef.current) {
      lastScrollPositionRef.current = terminalContentRef.current.scrollTop;
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const command = commands.find((c) => c.name === trimmedCmd);

    if (terminalContentRef.current) {
      lastScrollPositionRef.current = terminalContentRef.current.scrollTop;
    }

    setCommandHistory((prev) => [
      ...prev,
      `> ${cmd}`,
      command
        ? command.action()
        : 'Command not found. Type "help" for available commands.',
    ]);
    setInputValue('');
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className="bg-gray-900/95 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl w-full max-w-4xl h-[530px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center px-4 py-3 bg-gray-800/90 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex gap-2">
          <motion.div
            className="w-3.5 h-3.5 rounded-full bg-gray-400/90 cursor-pointer group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity absolute inset-0" />
          </motion.div>
          <motion.div
            className="w-3.5 h-3.5 rounded-full bg-gray-500/90 cursor-pointer group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity absolute inset-0" />
          </motion.div>
          <motion.div
            className="w-3.5 h-3.5 rounded-full bg-gray-600/90 cursor-pointer group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Square className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity absolute inset-0" />
          </motion.div>
        </div>
        <span className="ml-4 text-lg text-gray-200 font-mono font-medium">
          <span className="hidden sm:inline">dash-auth-terminal</span>
          <span className="inline sm:hidden">terminal</span>
        </span>
      </div>

      <div
        ref={terminalContentRef}
        onScroll={handleScroll}
        className="p-6 font-mono text-base overflow-y-auto flex-1 space-y-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50 transition-colors [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <AnimatePresence>
          {messages
            ?.slice(0, visibleLines)
            .map((message, index) => (
              <TerminalLine
                key={`msg-${message}-${index}`}
                text={message}
                index={index}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {commandHistory.map((line, index) => (
            <TerminalLine
              key={`cmd-${line}-${index}`}
              text={line}
              index={index}
              isCommand={true}
            />
          ))}
        </AnimatePresence>

        {isInteractive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-gray-100 mt-4"
          >
            <ChevronRight className="w-5 h-5 text-green-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  handleCommand(inputValue);
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-base text-gray-100 font-mono placeholder-gray-500"
              placeholder="Type 'help' for available commands..."
              autoFocus
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
