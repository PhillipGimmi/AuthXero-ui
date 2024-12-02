// DashboardSection.tsx

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingDots from '@/app/dashboard/components/LoadingDots/LoadingDots';
import DashboardHeader from './DashboardHeader';
import StatsGrid from './StatsGrid';
import ChartsGrid from './ChartsGrid';
import { authStats } from './auth-utils';

const DashboardSection: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingDots />
      </div>
    );
  }

  return (
    <section className="relative w-full py-20">
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.95 }} />
      <div className="relative max-w-7xl mx-auto px-4 space-y-16">
        <DashboardHeader />
        <StatsGrid stats={authStats} />
        <ChartsGrid />
        <div className="text-center mt-16">
          <Link
            href="/signin"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Discover more insights in your full dashboard...
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
