import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { DomainStep } from './steps/DomainStep';
import { PlatformStep } from './steps/PlatformStep';
import { SetupStep } from './steps/SetupStep';
import { CustomizationStep } from './steps/CustomizationStep';
import { ProgressBar } from './ProgressBar';
import { SETUP_OPTIONS } from './constants';
import { SetupOption, MousePosition } from './types';

interface SetupWizardProps {
  readonly onComplete: () => Promise<void>; // Ensure this returns a Promise<void>
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [domain, setDomain] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<
    SetupOption['id'] | null
  >(null);
  const [mousePositions, setMousePositions] = useState<
    Record<string, MousePosition>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
    if (step === 3) {
      setSelectedOption(null);
    }
  };

  const getBackText = () => {
    if (step === 2) return domain;
    if (step === 3 && selectedOption) {
      const option = SETUP_OPTIONS.find((opt) => opt.id === selectedOption);
      return option?.title ?? '';
    }
    return '';
  };

  const handleProceedToPlatform = (validatedDomain: string) => {
    if (!validatedDomain) {
      console.error('Invalid domain provided');
      return;
    }
    setDomain(validatedDomain);
    setStep(2);
  };

  const handlePlatformSelect = (optionId: SetupOption['id']) => {
    if (!SETUP_OPTIONS.some((opt) => opt.id === optionId)) {
      console.error('Invalid platform option selected');
      return;
    }
    setSelectedOption(optionId);
    setStep(3);
  };

  const handleSetupComplete = async () => {
    if (!selectedOption || !domain) {
      console.error(
        'Setup cannot proceed without domain and platform selection',
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        domain,
        platform: selectedOption,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const result = await response.json();
      console.log('Setup configuration saved:', result);

      setStep(4); // Move to CustomizationStep
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomizationComplete = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComplete(); // Ensure onComplete is awaited as it is a Promise
      console.log('SetupWizard completed successfully');
    } catch (error) {
      console.error('Customization step failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-100 dark:bg-white dark:text-black flex items-center justify-center p-6">
      <button
        onClick={toggleTheme}
        className="absolute top-[100px] left-4 px-4 py-2 rounded bg-gray-700 dark:bg-gray-300 text-white dark:text-black shadow-lg z-50 hover:bg-gray-600 dark:hover:bg-gray-400 transition-colors duration-300"
        style={{ pointerEvents: 'auto' }}
      >
        Toggle Theme
      </button>

      <div className="w-full max-w-4xl relative">
        {step > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="absolute top-0 left-0 flex items-center space-x-2 text-zinc-400 hover:text-white dark:hover:text-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-white dark:text-black truncate max-w-[200px]">
              {getBackText()}
            </span>
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <DomainStep initialValue="" onProceed={handleProceedToPlatform} />
          )}
          {step === 2 && (
            <PlatformStep
              mousePositions={mousePositions}
              setMousePositions={setMousePositions}
              selectedOption={selectedOption}
              onSelect={handlePlatformSelect}
              onBack={handleBack}
              previousDomain={domain}
            />
          )}
          {step === 3 && selectedOption && (
            <SetupStep
              domain={domain}
              selectedPlatform={selectedOption}
              onComplete={handleSetupComplete}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 4 && (
            <CustomizationStep
              onComplete={handleCustomizationComplete}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        <ProgressBar currentStep={step} totalSteps={4} />
      </div>
    </div>
  );
}
