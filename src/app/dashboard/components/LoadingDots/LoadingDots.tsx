'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface LoadingDotsProps {
  text?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ text = "Loading..." }) => {
  const dots = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-800/50 
      border border-zinc-700/50 backdrop-blur-xl">
      <div className="flex space-x-2">
        {dots.map((index) => (
          <motion.div
            key={`loading-dot-${index}`}
            className="h-2 w-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.6, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
      <span className="text-zinc-200 font-medium">{text}</span>
    </div>
  );
};

export default LoadingDots;
