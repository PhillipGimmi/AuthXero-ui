// constants.ts
import { 
    Globe, 
    Monitor, 
    Smartphone, 
    Apple 
  } from 'lucide-react';
  import { SetupOption } from './types';
  
  export const COMMON_EMAIL_PROVIDERS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'protonmail.com',
    'icloud.com'
  ] as const;
  
  export const SETUP_OPTIONS: SetupOption[] = [
    {
      id: 'spa',
      title: 'Single Page App',
      icon: Monitor,
      description: 'Perfect for React, Vue, or Angular applications'
    },
    {
      id: 'website',
      title: 'Traditional Website',
      icon: Globe,
      description: 'For server-rendered applications'
    },
    {
      id: 'android',
      title: 'Android App',
      icon: Smartphone,
      description: 'Native Android authentication'
    },
    {
      id: 'ios',
      title: 'iOS App',
      icon: Apple,
      description: 'Native iOS authentication'
    }
  ];
  