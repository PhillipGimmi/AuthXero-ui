import React, { useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Globe } from 'lucide-react';

interface DomainInputProps {
  domain: string;
  onChange: (value: string) => void;
}

export const DomainInput: React.FC<DomainInputProps> = ({ domain, onChange }) => {
  const turn = useMotionValue(0);
  const isValidDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain);
  
  useEffect(() => {
    const animation = animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });

    return () => animation.stop();
  }, [turn]); // Added turn to dependencies

  const getBorderColor = () => {
    if (domain === '') return '#ffffff';
    return isValidDomain ? '#22c55e' : '#ef4444';
  };

  const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, ${getBorderColor()}00 75%, ${getBorderColor()} 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <label 
        htmlFor="application-domain"
        className="block text-sm font-medium text-zinc-400"
      >
        Application Domain
      </label>
      <div className="relative setupOption">
        <input
          id="application-domain"
          type="text"
          value={domain}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your-app-domain.com"
          className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border-transparent
            focus:outline-none transition-all duration-200"
        />
        <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
        
        {/* Animated border */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            style={{
              backgroundImage,
            }}
            className="mask-with-browser-support absolute -inset-[1px] rounded-lg border border-transparent bg-origin-border"
          />
        </div>

        {/* Highlight effect */}
        <div className="highlight" />
      </div>
    </motion.div>
  );
};