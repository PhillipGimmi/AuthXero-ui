import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DashAuthLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex items-center"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 50 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-neutral-50"
        >
          <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
          <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
        </svg>
        <motion.span 
          className="ml-2 text-xl font-bold text-neutral-50 font-noto-sans-jp tracking-tight transition-all duration-300"
          whileHover={{
            textShadow: [
              "0 0 4px rgba(255,255,255,0.1)",
              "0 0 8px rgba(255,255,255,0.2)",
              "0 0 12px rgba(255,255,255,0.3)",
              "0 0 16px rgba(255,255,255,0.4)",
              "0 0 20px rgba(255,255,255,0.5)",
            ]
          }}
          transition={{
            textShadow: {
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }
          }}
        >
          Dash Auth
        </motion.span>
      </motion.div>
    </Link>
  );
};

export default DashAuthLogo;