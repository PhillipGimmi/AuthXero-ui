// Card.tsx
"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isExpanded: boolean;
}

export const Card = ({ children, className = '', onClick, isExpanded }: CardProps) => (
  <motion.div
    layout
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className={`
      rounded-2xl border border-zinc-800 
      backdrop-blur-sm transition-all duration-500
      ${isExpanded ? 'bg-white/95 text-black' : 'bg-black/95 text-white'}
      hover:border-zinc-600
      hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
      hover:backdrop-blur-xl
      ${className}
    `}
  >
    {children}
  </motion.div>
);
