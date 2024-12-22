'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface DashboardHeaderProps {
  user: { name?: string; email?: string };
  onExport?: () => void;
  onSettings?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onExport,
  onSettings,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Welcome back, {user?.name ?? user?.email}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExport}
          className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20
            hover:bg-blue-500/20 transition-colors"
        >
          Export Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSettings}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 
            transition-colors"
        >
          Settings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
