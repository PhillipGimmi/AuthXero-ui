import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface CustomizationStepProps {
  readonly onComplete: () => Promise<void>;
  readonly isSubmitting: boolean;
}

export const CustomizationStep: React.FC<CustomizationStepProps> = ({
  onComplete,
  isSubmitting,
}) => {
  const [selectedOption, setSelectedOption] = useState<'custom' | 'default'>(
    'default',
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleComplete = async () => {
    if (isSubmitting) return;

    try {
      setIsError(false);
      setErrorMessage(null);
      console.log(
        '[CustomizationStep] Completing with option:',
        selectedOption,
      );
      await onComplete();
    } catch (error) {
      console.error('[CustomizationStep] Completion failed:', error);
      setIsError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save customization preferences.',
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Customize Your Login Experience
        </h1>
        <p className="text-zinc-400">
          Choose how you want to implement the authentication UI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setSelectedOption('default')}
          disabled={isSubmitting}
          className={`p-6 rounded-lg border transition-all duration-200 backdrop-blur-sm ${
            selectedOption === 'default'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Paintbrush /> Use Default Components
          </h3>
          <p className="text-zinc-400 text-sm">
            Get started quickly with our pre-built, customizable authentication
            components
          </p>
        </button>

        <button
          onClick={() => setSelectedOption('custom')}
          disabled={isSubmitting}
          className={`p-6 rounded-lg border transition-all duration-200 backdrop-blur-sm ${
            selectedOption === 'custom'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Paintbrush /> Custom Implementation
          </h3>
          <p className="text-zinc-400 text-sm">
            Build your own UI components using our authentication hooks and
            utilities
          </p>
        </button>
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end items-center pt-6">
        <button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <ArrowRight className="animate-spin w-5 h-5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Complete Step</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
