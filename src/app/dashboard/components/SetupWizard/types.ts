// types.ts


export type PlatformId = 'spa' | 'website' | 'android' | 'ios';

export interface SetupDefaults {
  clientId: string;
  redirectUrl: string;
  configVersion: string;
  timestamp: string;
}

export interface SetupOption {
  id: PlatformId;  // Using the PlatformId type instead of inline union
  title: string;
  icon: React.ElementType;
  description: string;
}

export interface SetupWizardProps {
  userEmail: string;
  onComplete: () => void;
}

export interface MousePosition {
  x: number;
  y: number;
}

// You might also want to add some additional type helpers
export type PlatformConfig = {
  [K in PlatformId]: {
    setupInstructions: string;
    requiredDependencies: string[];
    configurationSteps: string[];
  }
};

export interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
}

export type SetupResponse = {
  success: boolean;
  platformId: PlatformId;
  config: SetupDefaults;
  timestamp: string;
};