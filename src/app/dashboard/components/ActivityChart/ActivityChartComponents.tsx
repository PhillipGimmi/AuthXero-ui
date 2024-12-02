import React from 'react';
import { motion } from 'framer-motion';

export const TimeHeader = ({ time }: { time: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 text-center text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent"
  >
    {time}
  </motion.div>
);

export interface CustomTooltipProps {
  label: string;
  value: string | number;
  color: string;
  isHovered?: boolean;
}

export const CustomTooltip = ({
  label,
  value,
  color,
  isHovered,
}: CustomTooltipProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300"
    style={{
      background: `linear-gradient(135deg, ${color}${
        isHovered ? '75' : '45'
      }, ${color}${isHovered ? '65' : '35'})`,
      border: `1px solid ${color}${isHovered ? '95' : '60'}`,
      boxShadow: isHovered
        ? `0 0 40px ${color}60, 0 0 20px ${color}40, inset 0 0 20px ${color}30`
        : `0 0 20px ${color}25`,
      transform: `scale(${isHovered ? 1.03 : 1})`,
      filter: isHovered ? 'brightness(1.3) contrast(1.1)' : 'none',
    }}
  >
    <span className="text-sm font-medium text-zinc-100">{label}</span>
    <span className="text-xl font-bold text-white">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
  </motion.div>
);

export const MetricDisplay: React.FC<{
  label: string;
  value: number | string;
  color: string;
  trend?: number;
}> = ({ label, value, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="flex flex-col items-center"
  >
    <div className="relative px-6 py-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-lg">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-zinc-300 text-sm font-medium">{label}</span>
        <span className="text-2xl font-bold" style={{ color }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full ${
              trend >= 0
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            } text-xs font-medium`}
          >
            <span className="text-sm">{trend >= 0 ? '↑' : '↓'}</span>
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export const LiveIndicator: React.FC<{ isLive: boolean }> = ({ isLive }) => (
  <div className="absolute top-4 right-4 flex items-center space-x-2">
    <motion.div
      animate={{
        opacity: isLive ? [1, 0.5, 1] : 1,
        scale: isLive ? [1, 0.95, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: isLive ? Infinity : 0,
        ease: 'easeInOut',
      }}
      className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10"
    >
      <span className="w-2 h-2 rounded-full bg-green-500" />
      {isLive && <span className="text-xs text-zinc-400">Live</span>}
    </motion.div>
  </div>
);