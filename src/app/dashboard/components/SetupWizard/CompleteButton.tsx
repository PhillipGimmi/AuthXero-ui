// components/CompleteButton.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CompleteButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const CompleteButton: React.FC<CompleteButtonProps> = ({
  onClick,
  isGenerating,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-end pt-4"
  >
    <button
      onClick={onClick}
      disabled={isGenerating}
      className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 
        transition-colors flex items-center gap-2 font-medium 
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <span
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Configuring...</span>
        </>
      ) : (
        <>
          Enable Auth
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  </motion.div>
);
