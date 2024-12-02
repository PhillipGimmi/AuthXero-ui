import React, { useState, useCallback } from 'react';
import { SetupWizardProps, SetupOption, MousePosition } from './types';
import { SETUP_OPTIONS } from './constants';
import { extractDomain, getCodeSnippet } from './utils';
import { Header } from './Header';
import { SetupOptionCard } from './SetupOptionCard';
import { CodePreview } from './CodePreview';
import { CompleteButton } from './CompleteButton';
import { DomainInput } from './DomainInput';

const SetupWizard: React.FC<SetupWizardProps> = ({ userEmail, onComplete }) => {
  const [domain, setDomain] = useState(() => extractDomain(userEmail));
  const [selectedOption, setSelectedOption] = useState<SetupOption['id'] | null>(null);
  const [mousePositions, setMousePositions] = useState<Record<string, MousePosition>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMouseMove = useCallback((optionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePositions(prev => ({
      ...prev,
      [optionId]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  }, []);

  const handleTouchMove = useCallback((optionId: string, e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePositions(prev => ({
      ...prev,
      [optionId]: {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    }));
  }, []);

  const handleMouseLeave = useCallback((optionId: string) => {
    setMousePositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[optionId];
      return newPositions;
    });
  }, []);

  const handleCopyCode = async () => {
    if (!selectedOption) return;
    try {
      const { code } = getCodeSnippet(selectedOption, domain);
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleComplete = async () => {
    if (!selectedOption || !domain) return;
    setIsGenerating(true);

    try {
      const { defaults } = getCodeSnippet(selectedOption, domain);
      
      // Save configuration
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          platform: selectedOption,
          config: defaults
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      // Generate minimal config file
      const configContent = `AUTHXERO_DOMAIN=${domain}\n# Secure defaults auto-configured`;
      const blob = new Blob([configContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env.authxero';
      a.click();
      URL.revokeObjectURL(url);

      onComplete();
    } catch (err) {
      console.error('Setup failed:', err);
      // Here you might want to show an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const codeSnippet = selectedOption ? getCodeSnippet(selectedOption, domain).code : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        
        <DomainInput 
          domain={domain}
          onChange={setDomain}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SETUP_OPTIONS.map((option) => (
            <SetupOptionCard
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              onSelect={() => setSelectedOption(option.id)}
              mousePosition={mousePositions[option.id]}
              onMouseMove={(e) => handleMouseMove(option.id, e)}
              onTouchMove={(e) => handleTouchMove(option.id, e)}
              onMouseLeave={() => handleMouseLeave(option.id)}
            />
          ))}
        </div>

        {selectedOption && (
          <CodePreview 
            code={codeSnippet}
            onCopy={handleCopyCode}
          />
        )}

        {selectedOption && (
          <CompleteButton
            onClick={handleComplete}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default SetupWizard;