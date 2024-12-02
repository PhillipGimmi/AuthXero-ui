"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Lock, FileCheck, ChevronDown } from 'lucide-react';
import { WebGLBackground } from './WebGLBackground'; 

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  businessValue: string;
  requirements: string[];
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isExpanded: boolean;
}

const Card = ({ children, className = '', onClick, isExpanded }: CardProps) => (
  <motion.div
    layout
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className={`
      rounded-2xl border border-zinc-800 
      backdrop-blur-sm transition-all duration-500
      ${isExpanded ? 'bg-white/95 text-black' : 'bg-black/95 text-white'}
      hover:border-zinc-600
      hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
      hover:backdrop-blur-xl
      ${className}
    `}
  >
    {children}
  </motion.div>
);

interface FrameworkCardProps {
  framework: Framework;
  isExpanded: boolean;
  onClick: () => void;
}

const FrameworkCard = ({ framework, isExpanded, onClick }: FrameworkCardProps) => {
  const Icon = framework.icon;
  
  return (
    <Card
      isExpanded={isExpanded}
      onClick={onClick}
      className="h-full p-6 cursor-pointer group hover:border-zinc-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <Icon className="w-8 h-8" />
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">{framework.name}</h3>
      <p className={`mb-6 ${isExpanded ? 'text-zinc-700' : 'text-zinc-400'}`}>
        {framework.description}
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-200 pt-4 mb-4">
              <h4 className="font-semibold mb-2">Why It Matters</h4>
              <p className="text-zinc-700 mb-4">{framework.businessValue}</p>
              
              <h4 className="font-semibold mb-2">Key Requirements</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {framework.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className={`space-y-3 ${isExpanded ? 'hidden' : 'block'}`}>
        {framework.features.map((feature: string, index: number) => (
          <motion.li
            key={index}
            className="flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
            <span className={isExpanded ? 'text-zinc-700' : 'text-zinc-300'}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
};

const ComplianceSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const frameworks: Framework[] = [
    {
      id: 'soc2',
      name: 'SOC 2',
      description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy',
      icon: Shield,
      features: [
        'Access Control & Authentication',
        'System Operations & Monitoring',
        'Risk Management & Security',
        'Data Protection & Privacy',
        'Incident Response Plans'
      ],
      businessValue: 'SOC 2 compliance is crucial for B2B SaaS companies. Our integrated solution provides continuous monitoring, automated evidence collection, and real-time compliance dashboards, saving your team countless hours of manual work.',
      requirements: ['Annual Audit', 'Continuous Monitoring', 'Security Controls', 'Employee Training']
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'European Union Data Protection and Privacy Standards',
      icon: Lock,
      features: [
        'Data Processing Agreements',
        'User Consent Management',
        'Right to Data Portability',
        'Privacy by Design',
        'Data Breach Notifications'
      ],
      businessValue: 'GDPR compliance is mandatory for serving EU customers. Our platform handles all GDPR requirements out-of-the-box, including consent management, data portability, and automated privacy impact assessments.',
      requirements: ['DPO Assignment', 'Privacy Impact Assessments', 'Data Processing Records', 'Breach Notifications']
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      description: 'Healthcare Data Security and Privacy',
      icon: FileCheck,
      features: [
        'PHI Data Encryption',
        'Access Controls & Auditing',
        'Business Associate Agreements',
        'Security Risk Analysis',
        'Breach Notification Protocol'
      ],
      businessValue: 'Healthcare companies must maintain HIPAA compliance or face severe penalties. Our solution provides comprehensive HIPAA compliance features, including BAA management and PHI handling protocols.',
      requirements: ['Privacy Rule', 'Security Rule', 'Breach Notification', 'Regular Risk Assessments']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  const handleCardClick = (id: string): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative w-full py-32 bg-black/95 overflow-hidden">
      <WebGLBackground />
      <div className="absolute inset-0 z-20 bg-grid-white/[0.05] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-20 max-w-7xl mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Enterprise-Grade Compliance
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
            One integrated solution for all your compliance needs. Automatic reporting, continuous monitoring, and real-time dashboards included.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {frameworks.map((framework) => (
            <motion.div key={framework.id} variants={itemVariants} layout className="h-full">
              <FrameworkCard
                framework={framework}
                isExpanded={expandedId === framework.id}
                onClick={() => handleCardClick(framework.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-xl font-semibold text-white mb-8">Additional Compliance Coverage</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              'ISO 27001', 'California Privacy Protection (CCPA)', 'POPIA', 
              'NIST', 'FedRAMP', 'FINRA', 'PCI DSS', 'FERPA', 'APPI'
            ].map((standard) => (
              <motion.div
                key={standard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors backdrop-blur-sm hover:backdrop-blur-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                {standard}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ComplianceSection;
