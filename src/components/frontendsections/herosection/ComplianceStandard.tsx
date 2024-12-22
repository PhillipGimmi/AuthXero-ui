import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ComplianceInfo = {
  [key: string]: {
    description: string;
    relevance: string;
  };
};

export const complianceInfo: ComplianceInfo = {
  'ISO 27001': {
    description: 'International security management standard',
    relevance:
      'Our authentication system automatically implements required access controls and provides audit-ready compliance reporting.',
  },
  'SOC 2': {
    description: 'Service organization security and privacy standard',
    relevance:
      'Built-in security monitoring and access controls help maintain SOC 2 compliance with automated audit trails.',
  },
  GDPR: {
    description: 'EU data protection and privacy regulation',
    relevance:
      'Our authentication handles user consent and data access controls in compliance with GDPR requirements.',
  },
  HIPAA: {
    description: 'Healthcare data privacy and security standard',
    relevance:
      'Pre-configured healthcare authentication workflows ensure HIPAA-compliant access control and audit logging.',
  },
  HITECH: {
    description: 'Healthcare technology security requirements',
    relevance:
      'Our system provides the required technical safeguards and breach notification capabilities.',
  },
  'PCI DSS': {
    description: 'Payment card industry security standard',
    relevance:
      'Authentication controls and session management align with PCI DSS requirements for secure access.',
  },
  CCPA: {
    description: 'California Consumer Privacy Act standard',
    relevance:
      'Built-in consent management and access controls help maintain CCPA compliance.',
  },
};

interface ComplianceStandardProps {
  standard: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const ComplianceStandard: React.FC<ComplianceStandardProps> = ({
  standard,
  isExpanded,
  onToggle,
}) => {
  const info = complianceInfo[standard];

  return (
    <motion.div layout className={`relative ${isExpanded ? 'col-span-3' : ''}`}>
      <motion.div
        layout
        onClick={onToggle}
        className={`
          group relative overflow-hidden rounded-lg border bg-gray-900 border-gray-800 cursor-pointer
          ${isExpanded ? 'hover:bg-gray-900' : ''}
        `}
      >
        {/* Orange overlay that only appears on hover when not expanded */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
        )}

        {/* Orange overlay for click/expand effect */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              className="absolute inset-0 bg-orange-500"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        <motion.div layout className="p-6 relative z-10">
          <motion.p
            layout
            className="text-xl text-white font-light text-center"
          >
            {standard}
          </motion.p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-6 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <div>
                    <h3 className="text-orange-400 text-sm uppercase tracking-wider mb-2">
                      About
                    </h3>
                    <p className="text-gray-300 text-lg">{info.description}</p>
                  </div>
                  <div>
                    <h3 className="text-orange-400 text-sm uppercase tracking-wider mb-2">
                      How We Help
                    </h3>
                    <p className="text-gray-300 text-lg">{info.relevance}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ComplianceStandard;
