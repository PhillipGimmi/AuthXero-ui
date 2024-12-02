import type { LucideIcon } from 'lucide-react';

export interface BusinessContext {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  compliance: string[];
  terminalMessages: string[];
}

export type BusinessContexts = {
  [key in 'enterprise' | 'healthcare' | 'ecommerce' | 'workforce']: BusinessContext;
};
