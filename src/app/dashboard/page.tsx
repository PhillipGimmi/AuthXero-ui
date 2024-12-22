'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingDots from './components/LoadingDots/LoadingDots';
import type { AuthContextType } from '@/types/auth';

// Dynamically import components with ssr: false to prevent hydration mismatch
const DashboardLayout = dynamic(() => import('./DashboardLayout'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingDots />
    </div>
  ),
});

const Dashboard = dynamic(() => import('./Dashboard'), {
  ssr: false,
});

const SetupWizard = dynamic(
  () => import('./components/SetupWizard/SetupWizard'),
  {
    ssr: false,
  },
);

export default function DashboardPage() {
  const { user, loading, refreshToken } = useAuth() as AuthContextType;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingDots />
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-zinc-200">
            Session Expired
          </h2>
          <p className="text-zinc-400">
            Please log in again to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingDots />
          </div>
        }
      >
        <div className="min-h-screen">
          {!user.isConfigured ? (
            <SetupWizard
              userEmail={user.email}
              onComplete={async () => {
                // Use refreshToken to get updated user data
                try {
                  await refreshToken();
                } catch (error) {
                  console.error('Failed to refresh user data:', error);
                }
              }}
            />
          ) : (
            <Dashboard />
          )}
        </div>
      </Suspense>
    </DashboardLayout>
  );
}
