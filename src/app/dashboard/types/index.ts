import type { LucideIcon } from 'lucide-react';

export type TimeRangeType = '24h' | '7d' | '30d';

export type TrendDirection = 'up' | 'down';
export type StatColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red';
export type ActivityStatus = 'success' | 'warning' | 'error';

export interface ChartCardProps {
  title: string;
  subtitle: string;
  chart?: React.ReactNode;
  content?: React.ReactNode;
}

export interface StatDetail {
  label: string;
  value: string;
}

export interface AuthStats {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: LucideIcon;
  color: StatColor;
  details: StatDetail[];
}

export interface TimeData {
  time: string;
  users: number;
  logins: number;
  signups: number;
  responseTime: number;
}

export interface LocationData {
  country: string;
  users: number;
  failedAttempts: number;
  avgResponseTime: number;
  mfaAdoption: number;
}

export interface SecurityIncident {
  day: string;
  bruteForce: number;
  suspicious: number;
  blocked: number;
}

export interface AuthMethod {
  name: string;
  value: number;
  trend: number;
}

export interface SessionData {
  time: string;
  active: number;
  average: number;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  user: string;
  time: string;
  location: string;
  status: ActivityStatus;
  icon: LucideIcon;
  details: string;
}
