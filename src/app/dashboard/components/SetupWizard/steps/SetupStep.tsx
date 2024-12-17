import React from 'react';
import { motion } from 'framer-motion';
import { SetupOption } from '../types';

interface SetupStepProps {
  readonly domain: string;
  readonly selectedPlatform: SetupOption['id'];
  readonly onComplete: () => Promise<void>;
  readonly isSubmitting: boolean;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  domain,
  selectedPlatform,
  onComplete,
  isSubmitting,
}) => {
  const handleComplete = async () => {
    if (isSubmitting) return;
    await onComplete();
  };

  const renderButtonContent = () => {
    if (isSubmitting) {
      return (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Setting up...</span>
        </span>
      );
    }
    return <span>Complete Setup</span>;
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Setup Instructions</h1>
        <p className="text-zinc-400">Follow these steps to complete setup</p>
      </div>

      <div className="bg-zinc-900/50 rounded-lg p-6 backdrop-blur-sm border border-zinc-800">
        <pre className="text-sm">
          <code className="text-blue-400">
            {`const config = {
  domain: "${domain}",
  platform: "${selectedPlatform}",
  timestamp: "${new Date().toISOString()}"
}`}
          </code>
        </pre>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {renderButtonContent()}
        </button>
      </div>
    </motion.div>
  );
};
