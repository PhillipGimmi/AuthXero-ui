'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, LucideIcon } from 'lucide-react';
import React from 'react';

interface StatDetail {
  label: string;
  value: string | number;
}

interface AuthStats {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'yellow' | 'rose' | 'purple';
  icon: LucideIcon;
  details: StatDetail[];
}

interface StatsCardProps {
  stat: AuthStats;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const getColorClasses = (color: AuthStats['color']) => ({
  bg: `bg-${color}-500/10`,
  ring: `ring-${color}-500/20`,
  text: `text-${color}-400`
});

const StatsCard: React.FC<StatsCardProps> = ({ stat, index, isSelected, onSelect }) => {
  const colors = getColorClasses(stat.color);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="relative p-6 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 
        border border-zinc-700/50 backdrop-blur-xl cursor-pointer hover:border-blue-500/50 
        hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colors.bg} ring-1 ${colors.ring}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {stat.trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-rose-500" />
        )}
        <span className={`text-sm ${
          stat.trend === 'up' ? 'text-green-500' : 'text-rose-500'
        }`}>
          {stat.change}% from last month
        </span>
      </div>

      <motion.div
        animate={{ height: isSelected ? 'auto' : 0 }}
        className="overflow-hidden mt-4"
      >
        {stat.details?.map((detail: StatDetail, index: number) => (
          <div 
            key={`${stat.label}-detail-${index}`}
            className="flex justify-between items-center mt-2 text-sm text-zinc-400"
          >
            <span>{detail.label}</span>
            <span className="font-medium text-zinc-300">{detail.value}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;
