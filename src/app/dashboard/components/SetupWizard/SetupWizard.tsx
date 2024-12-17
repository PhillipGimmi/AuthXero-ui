import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { DomainStep } from './steps/DomainStep';
import { PlatformStep } from './steps/PlatformStep';
import { SetupStep } from './steps/SetupStep';
import { ProgressBar } from './ProgressBar';
import { SETUP_OPTIONS } from './constants';
import { SetupOption, MousePosition } from './types';

interface AuthWizardProps {
  readonly onComplete: () => void;
}

export default function AuthWizard({ onComplete }: AuthWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [domain, setDomain] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<SetupOption['id'] | null>(null);
  const [mousePositions, setMousePositions] = useState<Record<string, MousePosition>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    setStep(step - 1);
    if (step === 3) {
      setSelectedOption(null);
    }
  };

  const getBackText = () => {
    if (step === 2) return domain; // Return domain when on PlatformStep
    if (step === 3 && selectedOption) {
      const option = SETUP_OPTIONS.find(opt => opt.id === selectedOption);
      return option?.title ?? '';
    }
    return '';
  };

  const handleProceedToPlatform = (validatedDomain: string) => {
    setDomain(validatedDomain);
    setStep(2);
  };
  

  const handlePlatformSelect = (optionId: SetupOption['id']) => {
    setSelectedOption(optionId);
    setStep(3);
  };

  const handleSetupComplete = async () => {
    if (!selectedOption || !domain) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          platform: selectedOption,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const configContent = `DOMAIN=${domain}\nPLATFORM=${selectedOption}\n`;
      const blob = new Blob([configContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env.auth';
      a.click();
      URL.revokeObjectURL(url);

      onComplete();
    } catch (err) {
      console.error('Setup failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl relative">
      {step > 1 && (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={handleBack}
    className="absolute top-0 left-0 flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
  >
    <ChevronLeft className="w-5 h-5" />
    <span className="text-white truncate max-w-[200px]">{getBackText()}</span>
  </motion.button>
)}


        <AnimatePresence mode="wait">
          {step === 1 && (
            <DomainStep 
              initialValue={''}
              onProceed={handleProceedToPlatform} 
            />
          )}

{step === 2 && (
  <PlatformStep
    mousePositions={mousePositions}
    setMousePositions={setMousePositions}
    selectedOption={selectedOption}
    onSelect={handlePlatformSelect}
    onBack={handleBack}
    previousDomain={domain} // Pass domain to PlatformStep
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
        </AnimatePresence>

        <ProgressBar currentStep={step} totalSteps={3} />
      </div>
    </div>
  );
}