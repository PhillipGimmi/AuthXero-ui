import React from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  SecurityMetric,
  GeoSecurityData,
  TooltipProps,
  getChangeColor,
} from './security-types';
// Helper function
function getArrow(value: number): string {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '→';
}

export const CustomTooltip: React.FC<TooltipProps> = ({
  active,
  content,
  mousePosition,
}) => {
  if (!active || !mousePosition) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <motion.div
      className="fixed w-[220px] p-4 rounded-lg bg-[#1A1A1A] shadow-lg border-none z-[99999] pointer-events-none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        left:
          mousePosition.x + 220 > window.innerWidth
            ? mousePosition.x - 230
            : mousePosition.x + 10,
        top: mousePosition.y - 70,
      }}
    >
      {content.title && (
        <div className="text-sm text-gray-400 mb-1 text-center">
          {content.title}
        </div>
      )}
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-1 leading-tight">
          {typeof content.value === 'number'
            ? content.value.toLocaleString()
            : content.value}
        </div>
      </div>
      {content.subValue && (
        <div className="text-xs text-gray-500 text-center">
          {content.subValue}
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-400 capitalize">
          {content.description ?? 'Events'}
        </div>
        {content.change && (
          <div
            className={`text-sm font-medium ${getChangeColor(content.change.value)}`}
          >
            <span>{getArrow(content.change.value)}</span>
            <span>{Math.abs(content.change.value).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
};

interface RegionCardProps {
  data: GeoSecurityData;
  isSelected: boolean;
  onHover: (
    content: TooltipProps['content'] | null,
    event?: React.MouseEvent,
  ) => void;
  onClick: () => void;
}

export const RegionCard: React.FC<RegionCardProps> = ({
  data,
  isSelected,
  onHover,
  onClick,
}) => {
  const handleMetricHover = (
    metric: SecurityMetric,
    event: React.MouseEvent,
  ) => {
    onHover(
      {
        title: metric.time,
        value: metric.value,
        description: data.region,
        change: {
          value:
            ((metric.value - metric.previousValue) / metric.previousValue) *
            100,
          label: 'previous',
        },
      },
      event,
    );
  };

  const handleCardHover = (event: React.MouseEvent) => {
    if (!isSelected) {
      onHover(
        {
          title: data.region,
          value: data.failedAttempts,
          description: `${data.blockedIPs} blocked IPs`,
          subValue: `Risk Level: ${data.riskLevel.toUpperCase()}`,
        },
        event,
      );
    }
  };

  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'high':
        return {
          text: 'text-white group-hover:text-white group-hover:animate-pulse',
          bg: 'bg-white/20 group-hover:bg-green-500',
          glow: 'group-hover:shadow-[0_0_30px_#22c55e]',
          boxShadow: 'group-hover:shadow-[0_0_20px_#22c55e]',
        };
      case 'medium':
        return {
          text: 'text-white group-hover:text-white',
          bg: 'bg-white/20 group-hover:bg-green-500/60',
          glow: 'group-hover:shadow-[0_0_20px_#22c55e]',
          boxShadow: 'group-hover:shadow-[0_0_10px_#22c55e]',
        };
      default:
        return {
          text: 'text-white',
          bg: 'bg-white/20 group-hover:bg-green-500/30',
          glow: 'group-hover:shadow-[0_0_10px_#22c55e]',
          boxShadow: 'group-hover:shadow-[0_0_5px_#22c55e]',
        };
    }
  };
  const riskStyles = getRiskStyles(data.riskLevel);

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={() => onHover(null)}
      className={`relative p-4 rounded-xl cursor-pointer ${
        isSelected ? 'bg-white/10' : 'bg-white/5'
      } hover:bg-white/10 transition-colors group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div layout className="flex justify-between items-start mb-4">
        <div>
          <motion.h3 layout className="text-lg font-medium text-white">
            {data.region}
          </motion.h3>
          <motion.p layout className="text-sm text-zinc-400">
            {data.blockedIPs} blocked IPs
          </motion.p>
        </div>
        <motion.div
          layout
          className={`text-sm px-2 py-1 rounded-full transition-all duration-300 ${riskStyles.text} ${riskStyles.bg}`}
        >
          {data.riskLevel}
        </motion.div>
      </motion.div>

      <motion.div layout className="relative h-20 flex items-end gap-1 mb-4">
        {data.metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={`relative flex-1 bg-white group-hover:bg-green-500 transition-all duration-300 ${riskStyles.glow}`}
            initial={{ height: 0 }}
            animate={{ height: `${(metric.value / 150) * 100}%` }}
            onMouseEnter={(e) => handleMetricHover(metric, e)}
            onMouseLeave={() => onHover(null)}
            transition={{
              duration: 0.5,
              delay: metric.id * 0.02,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <div className="text-sm text-zinc-400">Failed Attempts</div>
            <div className="text-lg font-medium text-white">
              {data.failedAttempts.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Anomaly Score</div>
            <div className="text-lg font-medium text-white">
              {data.anomalyScore.toFixed(1)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
