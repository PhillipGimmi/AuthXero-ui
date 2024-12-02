import type { TimeData, LocationData, AuthMethod, SecurityIncident, SessionData } from '../types';

export const COLORS = {
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#6366F1',
  red: '#EF4444',
  indigo: '#4F46E5',
} as const;

export const TIME_RANGES = ['24h', '7d', '30d'] as const;

export const MOCK_DATA = {
  timeData: [
    { time: '00:00', users: 200, logins: 150, signups: 5, responseTime: 45 },
    { time: '04:00', users: 350, logins: 250, signups: 8, responseTime: 42 },
    { time: '08:00', users: 800, logins: 650, signups: 15, responseTime: 48 },
    { time: '12:00', users: 1200, logins: 950, signups: 25, responseTime: 52 },
    { time: '16:00', users: 950, logins: 750, signups: 20, responseTime: 47 },
    { time: '20:00', users: 600, logins: 450, signups: 12, responseTime: 44 },
  ] satisfies TimeData[],

  locationData: [
    { country: 'USA', users: 1200, failedAttempts: 45, avgResponseTime: 42, mfaAdoption: 85 },
    { country: 'UK', users: 850, failedAttempts: 28, avgResponseTime: 38, mfaAdoption: 78 },
    { country: 'Germany', users: 750, failedAttempts: 22, avgResponseTime: 40, mfaAdoption: 92 },
    { country: 'Japan', users: 650, failedAttempts: 18, avgResponseTime: 45, mfaAdoption: 95 },
    { country: 'Canada', users: 550, failedAttempts: 15, avgResponseTime: 37, mfaAdoption: 88 },
  ] satisfies LocationData[],

  authMethods: [
    { name: 'Password', value: 45, trend: -5 },
    { name: 'OAuth', value: 30, trend: 8 },
    { name: 'WebAuthn', value: 15, trend: 12 },
    { name: 'Magic Link', value: 10, trend: 15 },
  ] satisfies AuthMethod[],

  securityIncidents: [
    { day: 'Mon', bruteForce: 12, suspicious: 5, blocked: 8 },
    { day: 'Tue', bruteForce: 8, suspicious: 7, blocked: 10 },
    { day: 'Wed', bruteForce: 15, suspicious: 3, blocked: 12 },
    { day: 'Thu', bruteForce: 10, suspicious: 8, blocked: 15 },
    { day: 'Fri', bruteForce: 7, suspicious: 6, blocked: 9 },
  ] satisfies SecurityIncident[],

  sessionData: [
    { time: '00:00', active: 1250, average: 15 },
    { time: '04:00', active: 2100, average: 18 },
    { time: '08:00', active: 3800, average: 22 },
    { time: '12:00', active: 4500, average: 25 },
    { time: '16:00', active: 4100, average: 21 },
    { time: '20:00', active: 2800, average: 19 },
  ] satisfies SessionData[]
};
