import React from 'react';
import { motion } from 'framer-motion';

const SpinnerAnimation = () => {
  const TOTAL_PARTICLES = 100;
  const particles = Array.from(
    { length: TOTAL_PARTICLES }, 
    (_, index) => `particle-${index.toString().padStart(3, '0')}`
  );
  
  const generateStyles = () => {
    const particleStyles = particles.map((_, index) => `
      .particle:nth-child(${index + 1}) {
        transform: rotate(${(index / TOTAL_PARTICLES) * 360}deg) translate3d(100px, 0, 0);
      }
      
      .particle:nth-child(${index + 1}) b {
        animation-delay: ${index * (3 / (TOTAL_PARTICLES - 2))}s;
      }
    `).join('\n');

    return `
      .spinner {
        position: relative;
        perspective: 200px;
      }
      
      .particle {
        display: block;
        position: absolute;
        opacity: 1;
      }
      
      .particle b {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background: rgba(255,255,255,1);
        animation: spin 3s ease-in-out infinite,
                  colorCycle 12s ease-in-out infinite;
        animation-timing-function: ease-in-out;
      }
      
      ${particleStyles}
      
      @keyframes spin {
        0% {
          transform: scale(1);
          box-shadow: 0px 0px 14px currentColor;
        }
        15% {
          transform: translate(-3px, -3px) scale(3);
          box-shadow: 0px 0px 14px currentColor;
        }
        50% {
          transform: scale(1);
          box-shadow: 0px 0px 14px currentColor;
        }
      }

      @keyframes colorCycle {
        0%, 100% {
          color: rgba(255, 255, 255, 1);
        }
        25% {
          color: rgba(147, 197, 253, 1);
        }
        50% {
          color: rgba(167, 243, 208, 1);
        }
        75% {
          color: rgba(255, 255, 255, 1);
        }
      }
    `;
  };
  
  return (
    <>
      <style>{generateStyles()}</style>
      <div className="spinner">
        {particles.map((particleId) => (
          <i key={particleId} className="particle">
            <b />
          </i>
        ))}
      </div>
    </>
  );
};

export const LoadingOverlay = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-zinc-950 backdrop-blur-md z-[9999] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="w-64 h-64 flex items-center justify-center">
            <SpinnerAnimation />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 font-medium"
          >
            Signing out...
          </motion.p>
        </div>
      </motion.div>
    );
  };

export default LoadingOverlay;