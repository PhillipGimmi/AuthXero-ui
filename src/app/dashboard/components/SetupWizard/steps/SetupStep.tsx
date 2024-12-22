// SetupStep.tsx (Step 3)
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SetupOption } from '../types';
import {
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

interface SetupStepProps {
  readonly domain: string;
  readonly selectedPlatform: SetupOption['id'];
  readonly onComplete: () => Promise<void>;
  readonly isSubmitting: boolean;
}

interface ConfigState {
  clientId: string;
  isLoading: boolean;
  isError: boolean;
  verificationStatus: 'pending' | 'success' | 'failed' | 'skipped';
  errorMessage?: string;
}

interface ServerResponse {
  clientId: string;
  domain: string;
  platformType: string;
  status: 'success' | 'error';
  message?: string;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  domain,
  selectedPlatform,
  onComplete,
  isSubmitting,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [config, setConfig] = useState<ConfigState>({
    clientId: '',
    isLoading: true,
    isError: false,
    verificationStatus: 'pending',
  });

  const generateClientId = useCallback(async () => {
    const requestData = {
      domain,
      platformType: selectedPlatform,
      timestamp: new Date().toISOString(),
    };

    console.log('[SetupStep] Generating configuration:', requestData);

    setConfig((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const response = await fetch('/api/auth/setup/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data: ServerResponse = await response.json();
      console.log('[SetupStep] Server response:', data);

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to generate configuration');
      }

      if (data.status === 'success' && data.clientId) {
        setConfig((prev) => ({
          ...prev,
          clientId: data.clientId,
          isLoading: false,
          isError: false,
          verificationStatus: 'pending',
        }));
        console.log('[SetupStep] Configuration generated:', data.clientId);
      } else {
        throw new Error('Invalid server response format');
      }
    } catch (error) {
      console.error('[SetupStep] Configuration generation failed:', error);
      setConfig((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, [domain, selectedPlatform]);

  useEffect(() => {
    generateClientId();
  }, [generateClientId]);

  const getEmbedCode = useCallback(() => {
    return `<script src="https://auth.dashauth.com/${config.clientId}/auth.js" async></script>
<script>
  window.addEventListener('load', function() {
    DashAuth.init({
      clientId: '${config.clientId}',
      domain: '${domain}',
      platform: '${selectedPlatform}'
    });
  });
</script>`;
}, [config.clientId, domain, selectedPlatform]);

  const handleCopyCode = async () => {
    const embedCode = getEmbedCode();
    try {
      await navigator.clipboard.writeText(embedCode);
      console.log('[SetupStep] Code copied to clipboard');
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowVerificationOptions(true);
      }, 2000);
    } catch (error) {
      console.error('[SetupStep] Copy failed:', error);
      // Use native alert for simplicity since we're avoiding UI components
      alert('Failed to copy code to clipboard. Please try again.');
    }
  };

  const verifyImplementation = async () => {
    setIsVerifying(true);

    try {
      // Start verification process
      console.log(
        '[SetupStep] Starting verification for clientId:',
        config.clientId,
      );

      const response = await fetch(
        `https://auth.dashauth.com/${config.clientId}/verify`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        console.log('[SetupStep] Verification successful');
        setConfig((prev) => ({ ...prev, verificationStatus: 'success' }));
        await handleComplete();
      } else {
        console.error(
          '[SetupStep] Verification failed:',
          await response.text(),
        );
        setConfig((prev) => ({ ...prev, verificationStatus: 'failed' }));
      }
    } catch (error) {
      console.error('[SetupStep] Verification error:', error);
      setConfig((prev) => ({ ...prev, verificationStatus: 'failed' }));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkipVerification = async () => {
    console.log('[SetupStep] Skipping verification');
    setConfig((prev) => ({ ...prev, verificationStatus: 'skipped' }));

    // Proceed to the next step
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      if (!config.clientId) {
        console.warn(
          '[SetupStep] No clientId available. Proceeding without configuration.',
        );
      }

      console.log('[SetupStep] Completing setup with data:', {
        clientId: config.clientId,
        domain,
        platformType: selectedPlatform,
      });

      if (config.clientId) {
        const requestData = {
          clientId: config.clientId,
          domain,
          platformType: selectedPlatform,
        };

        const response = await fetch('/api/auth/setup/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to complete setup');
        }
      }

      await onComplete(); // Correctly triggers transition in SetupWizard
    } catch (error) {
      console.error('[SetupStep] Completion failed:', error);
      alert('Failed to complete setup. Please try again.');
    }
  };

  if (config.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Add Authentication
        </h1>
        <p className="text-zinc-400">
          Add this script to your website&apos;s &lt;head&gt; tag
        </p>
      </div>

      <div className="bg-zinc-900/50 rounded-lg p-6 backdrop-blur-sm border border-zinc-800">
        <pre className="text-sm bg-black/30 p-4 rounded-lg overflow-x-auto">
          <code className="text-blue-400">{getEmbedCode()}</code>
        </pre>
      </div>

      <div className="bg-zinc-900/50 rounded-lg p-6 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Installation Steps</h3>
        <ol className="list-decimal list-inside space-y-4 text-zinc-300">
          <li>Copy the code above</li>
          <li>Paste it in your website&apos;s &lt;head&gt; tag</li>
          <li>Save and deploy your changes</li>
          {showVerificationOptions && (
            <li className="text-blue-400">
              Verify your installation or continue to the next step
            </li>
          )}
        </ol>
      </div>

      {showVerificationOptions ? (
        <div className="space-y-4">
          {config.verificationStatus === 'failed' && (
            <div className="flex items-center gap-2 p-4 text-red-400 bg-red-900/10 border border-red-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>
                Verification failed. Please check if you&apos;ve added the
                script correctly.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
            <button
              onClick={verifyImplementation}
              disabled={isVerifying || config.verificationStatus === 'success'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 
                       bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Verify Installation</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkipVerification}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 
                       bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 
                       transition-colors duration-200 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Skip Verification'
              )}
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-blue-900/10 border border-blue-900/20 rounded-lg text-blue-400">
              <p>
                You&apos;re in development mode. Script verification might not
                work locally. Feel free to skip verification and test in
                production.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <button
            onClick={handleCopyCode}
            disabled={copied}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white 
                     rounded-lg hover:bg-zinc-700 transition-colors duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     disabled:hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      )}

      {config.isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {config.errorMessage ??
            'Failed to generate configuration. Please try again.'}
        </div>
      )}
    </motion.div>
  );
};
