import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GeoSecurityData,
  TooltipProps,
  failureReasons,
} from './security-types';

interface GlobalSecurityViewProps {
  data: GeoSecurityData[];
  onHover: (
    content: TooltipProps['content'] | null,
    event?: React.MouseEvent,
  ) => void;
}

const GlobalSecurityView: React.FC<GlobalSecurityViewProps> = ({
  data,
  onHover,
}) => {
  const totalFailedAttempts = useMemo(
    () => data.reduce((sum, region) => sum + region.failedAttempts, 0),
    [data],
  );

  const handleReasonHover = (
    reason: (typeof failureReasons)[0],
    event: React.MouseEvent,
  ) => {
    onHover(
      {
        title: reason.reason,
        value: `${reason.percentage}%`,
        description: `${Math.round((totalFailedAttempts * reason.percentage) / 100).toLocaleString()} events`,
      },
      event,
    );
  };

  const handleRegionHover = (
    region: GeoSecurityData,
    event: React.MouseEvent,
  ) => {
    onHover(
      {
        title: region.region,
        value: `${((region.failedAttempts / totalFailedAttempts) * 100).toFixed(1)}%`,
        description: `${region.failedAttempts.toLocaleString()} failed attempts`,
      },
      event,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6"
    >
      <div className="text-3xl font-bold text-white text-center mb-4">
        {totalFailedAttempts.toLocaleString()} Failed Attempts
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {failureReasons.map((reason, index) => (
          <motion.div
            key={reason.reason}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-white/5 group"
            onMouseEnter={(e) => handleReasonHover(reason, e)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="text-sm text-zinc-400 mb-2">{reason.reason}</div>
            <div className="text-2xl font-bold text-white">
              {reason.percentage}%
            </div>
            <motion.div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reason.percentage}%` }}
                className="h-full rounded-full bg-white group-hover:bg-green-500"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div className="grid grid-cols-4 gap-2">
        {data.map((region, index) => (
          <motion.div
            key={region.region}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-white/5 text-center"
            onMouseEnter={(e) => handleRegionHover(region, e)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="text-sm text-zinc-400 mb-1">{region.region}</div>
            <div className="text-lg font-medium text-white">
              {((region.failedAttempts / totalFailedAttempts) * 100).toFixed(1)}
              %
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GlobalSecurityView;
