import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { Card } from './Card';
import type { ElementType, ReactNode } from 'react';

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
  features: string[];
  businessValue: string;
  requirements: string[];
}

interface FrameworkCardProps {
  framework: Framework;
  isExpanded: boolean;
  onClick: () => void;
}

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5
    }
  })
};

const expandedVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const FrameworkCard = ({ framework, isExpanded, onClick }: FrameworkCardProps): ReactNode => {
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

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            variants={expandedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-200 pt-4 mb-4">
              <h4 className="font-semibold mb-2">Why It Matters</h4>
              <p className="text-zinc-700 mb-4">{framework.businessValue}</p>
              
              <h4 className="font-semibold mb-2">Key Requirements</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {framework.requirements.map((requirement: string, index: number) => (
                  <motion.li
                    key={index}
                    variants={featureVariants}
                    custom={index}
                    className="flex items-center gap-2 text-sm text-zinc-700"
                  >
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{requirement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <ul className="space-y-3">
            {framework.features.map((feature: string, index: number) => (
              <motion.li
                key={index}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="flex items-start gap-3"
                viewport={{ once: false }}
              >
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-zinc-300">{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </Card>
  );
};