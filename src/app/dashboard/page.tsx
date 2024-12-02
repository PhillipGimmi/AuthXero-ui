'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Building2, Users, ShoppingBag, Stethoscope, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BusinessContext {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  features: string[];
}

interface ComplianceInfo {
  title: string;
  desc: string;
  details: {
    requirements: string[];
    benefits: string[];
    industries: string[];
  };
}

type BusinessContexts = {
  [key in 'enterprise' | 'healthcare' | 'ecommerce' | 'workforce']: BusinessContext;
};

const HeroSection = () => {
  const [activeContext, setActiveContext] = useState<keyof BusinessContexts>('enterprise');
  const [activeCompliance, setActiveCompliance] = useState<string | null>(null);
  const [showComplianceDetails, setShowComplianceDetails] = useState(false);

  const businessContexts: BusinessContexts = {
    enterprise: {
      icon: Building2,
      title: "Secure access for enterprises",
      subtitle: "Not unauthorized users",
      description: "Protect your organization with enterprise-grade session management that keeps bad actors out while maintaining a seamless experience for legitimate users.",
      focus: "Zero-trust architecture with complete audit trails",
      features: [
        "Real-time threat detection and response",
        "Customizable security policies",
        "Advanced user authentication",
        "Comprehensive audit logging"
      ]
    },
    healthcare: {
      icon: Stethoscope,
      title: "Secure access for patients",
      subtitle: "Not identity thieves",
      description: "HIPAA-compliant session management that protects sensitive medical data while providing easy access for patients and healthcare providers.",
      focus: "HIPAA-ready with built-in compliance monitoring",
      features: [
        "PHI data encryption",
        "Role-based access control",
        "Automated compliance reporting",
        "Secure patient portal integration"
      ]
    },
    ecommerce: {
      icon: ShoppingBag,
      title: "Secure access for shoppers",
      subtitle: "Not fraudsters",
      description: "Protect your customers and revenue with robust session management that prevents account takeovers and fraud attempts.",
      focus: "Real-time fraud detection and prevention",
      features: [
        "AI-powered fraud detection",
        "Secure payment processing",
        "Customer identity verification",
        "Transaction monitoring"
      ]
    },
    workforce: {
      icon: Users,
      title: "Secure access for employees",
      subtitle: "Not bad actors",
      description: "Keep your workforce productive and secure with seamless session management that works across all your internal tools.",
      focus: "Single sign-on with comprehensive audit logs",
      features: [
        "Cross-platform SSO",
        "Device trust verification",
        "Access policy management",
        "Employee activity monitoring"
      ]
    }
  };

  const complianceInfo: { [key: string]: ComplianceInfo } = {
    "GDPR": {
      title: "GDPR",
      desc: "European data protection and privacy",
      details: {
        requirements: [
          "Data processing documentation",
          "Privacy impact assessments",
          "Consent management",
          "Right to be forgotten"
        ],
        benefits: [
          "Access to EU market",
          "Enhanced customer trust",
          "Reduced data breach risks"
        ],
        industries: [
          "Technology",
          "Healthcare",
          "Finance",
          "Retail"
        ]
      }
    },
    "HIPAA": {
      title: "HIPAA",
      desc: "Healthcare data protection and privacy",
      details: {
        requirements: [
          "PHI safeguards",
          "Access controls",
          "Audit trails",
          "Breach notifications"
        ],
        benefits: [
          "Healthcare compliance",
          "Patient trust",
          "Reduced liability"
        ],
        industries: [
          "Healthcare",
          "Insurance",
          "Medical devices",
          "Telehealth"
        ]
      }
    }
  };

  const ContextIcon = businessContexts[activeContext].icon;

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-black" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        {/* Context Selector */}
        <div className="flex justify-center gap-4 mb-16">
          {Object.entries(businessContexts).map(([key, context]) => {
            const Icon = context.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveContext(key as keyof BusinessContexts)}
                className={`group relative px-6 py-3 rounded-lg transition-all duration-300
                  ${activeContext === key 
                    ? 'bg-white/10 shadow-lg' 
                    : 'hover:bg-white/5'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${
                    activeContext === key ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    activeContext === key ? 'text-white' : 'text-gray-400'
                  }`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
                {activeContext === key && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ContextIcon className="h-8 w-8 text-blue-400" />
              <span className="text-gray-400 text-lg">
                Protecting {activeContext}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white">
                {businessContexts[activeContext].title}
                <span className="block text-2xl text-red-400/80 mt-2">
                  {businessContexts[activeContext].subtitle}
                </span>
              </h1>

              <p className="text-xl text-gray-300">
                {businessContexts[activeContext].description}
              </p>

              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="h-5 w-5 text-blue-400" />
                <span>{businessContexts[activeContext].focus}</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {businessContexts[activeContext].features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-6">
              <button className="group px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
                <span className="flex items-center gap-2 text-white font-medium">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                <span className="text-white font-medium">Request Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column - Compliance Info */}
          <div className="relative">
            <div className="sticky top-8 space-y-8 p-8 rounded-2xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white">Compliance Standards</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(complianceInfo).map(([standard, info]) => (
                  <div
                    key={standard}
                    className="relative p-6 rounded-xl bg-black/50 hover:bg-black/70 
                             border border-white/10 transition-all cursor-pointer"
                    onMouseEnter={() => {
                      setActiveCompliance(standard);
                      setShowComplianceDetails(true);
                    }}
                    onMouseLeave={() => {
                      setActiveCompliance(null);
                      setShowComplianceDetails(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <span className="text-white font-medium">{standard}</span>
                      </div>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">{info.desc}</p>

                    {activeCompliance === standard && showComplianceDetails && (
                      <div className="absolute top-full left-0 w-full mt-2 p-6 
                                    rounded-xl bg-black/90 border border-white/10 z-10">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
                            <ul className="space-y-1">
                              {info.details.requirements.map((req, index) => (
                                <li key={index} className="text-sm text-gray-400">{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Benefits</h4>
                            <ul className="space-y-1">
                              {info.details.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-gray-400">{benefit}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Industries</h4>
                            <div className="flex flex-wrap gap-2">
                              {info.details.industries.map((industry, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400"
                                >
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;