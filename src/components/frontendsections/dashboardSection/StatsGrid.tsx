// StatsGrid.tsx

import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';
import { AuthStat } from './auth-utils';

export interface StatsGridProps {
  stats: AuthStat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
          }}
        >
          <StatsCard stat={stat} index={index} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
