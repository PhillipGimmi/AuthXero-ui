import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface SecurityMetric {
  id: number;
  time: string;
  value: number;
  previousValue: number;
}

interface GeoSecurityData {
  region: string;
  failedAttempts: number;
  blockedIPs: number;
  anomalyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  metrics: SecurityMetric[];
}

interface GeographicDistributionProps {
  data: Array<{
    country: string;
    users: number;
    mfaAdoption: number;
  }>;
  primaryColor?: string;
}

interface TooltipProps {
  active?: boolean;
  content: {
    title?: string;
    value: string | number;
    subValue?: string | number;
    description?: string;
    change?: {
      value: number;
      label?: string;
    };
  };
  mousePosition: { x: number; y: number } | null;
}

const defaultProps = {
  primaryColor: '#3B82F6' // Default to blue-500
};

const getChangeColor = (value: number) => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-white';
};
const getChangeSymbol = (value: number): string => {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '→';
};
const CustomTooltip: React.FC<TooltipProps> = ({ active, content, mousePosition }) => {
  if (!active || !mousePosition) return null;
  if (typeof window === 'undefined') return null;
  
  return createPortal(
    <motion.div 
      className="fixed w-[220px] p-4 rounded-lg bg-[#1A1A1A] shadow-lg border-none z-[99999] pointer-events-none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        left: mousePosition.x + 220 > window.innerWidth ? mousePosition.x - 230 : mousePosition.x + 10,
        top: mousePosition.y - 70,
      }}
    >
      {content.title && (
        <div className="text-sm text-gray-400 mb-1 text-center">{content.title}</div>
      )}
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-1 leading-tight">
          {typeof content.value === 'number' ? content.value.toLocaleString() : content.value}
        </div>
      </div>
      {content.subValue && (
        <div className="text-xs text-gray-500 text-center">{content.subValue}</div>
      )}
      <div className="flex items-center justify-between mt-2">
      <div className="text-sm text-gray-400 capitalize"> 
    {content.description ?? 'Events'} 
  </div> 
        {content.change && ( 
          <div className={`text-sm font-medium ${getChangeColor(content.change.value)}`}> 
            <span>{getChangeSymbol(content.change.value)}</span>
            <span>{Math.abs(content.change.value).toFixed(1)}%</span> 
          </div>
        )} 


      </div>
    </motion.div>,
    document.body
  );
};

const generateMetrics = (base: number): SecurityMetric[] => 
  Array.from({ length: 24 }, (_, i) => ({
    id: i,
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.round(base + Math.random() * base * 0.2),
    previousValue: Math.round(base * 0.95)
  }));

const generateData = (): GeoSecurityData[] => [
  {
    region: 'Asia Pacific',
    failedAttempts: 2840,
    blockedIPs: 142,
    anomalyScore: 8.4,
    riskLevel: 'high',
    metrics: generateMetrics(120)
  },
  {
    region: 'North America',
    failedAttempts: 1560,
    blockedIPs: 89,
    anomalyScore: 4.2,
    riskLevel: 'medium',
    metrics: generateMetrics(80)
  },
  {
    region: 'Europe',
    failedAttempts: 1980,
    blockedIPs: 115,
    anomalyScore: 6.7,
    riskLevel: 'high',
    metrics: generateMetrics(100)
  },
  {
    region: 'South America',
    failedAttempts: 890,
    blockedIPs: 67,
    anomalyScore: 5.1,
    riskLevel: 'low',
    metrics: generateMetrics(60)
  }
];

const failureReasons = [
  { reason: 'Invalid Credentials', percentage: 45 },
  { reason: '2FA Failed', percentage: 30 },
  { reason: 'Token Expired', percentage: 15 },
  { reason: 'Rate Limited', percentage: 10 }
];

const getRiskColor = (level: string, primaryColor: string): string => {
  switch (level) {
    case 'high':
      return '#ef4444';  // red-500
    case 'medium':
      return '#f59e0b';  // amber-500
    case 'low':
      return primaryColor;
    default:
      return primaryColor;
  }
};

const RegionCard: React.FC<{
  data: GeoSecurityData;
  isSelected: boolean;
  onHover: (content: TooltipProps['content'] | null, event?: React.MouseEvent) => void;
  onClick: () => void;
  primaryColor: string;
}> = ({ data, isSelected, onHover, onClick, primaryColor }) => {
  const riskColor = getRiskColor(data.riskLevel, primaryColor);

  const handleMetricHover = (metric: SecurityMetric, event: React.MouseEvent) => {
    onHover({
      title: metric.time,
      value: metric.value,
      description: data.region,
      change: {
        value: ((metric.value - metric.previousValue) / metric.previousValue) * 100,
        label: 'previous'
      }
    }, event);
  };

  const handleCardHover = (event: React.MouseEvent) => {
    if (!isSelected) {
      onHover({
        title: data.region,
        value: data.failedAttempts,
        description: `${data.blockedIPs} blocked IPs`,
        subValue: `Risk Level: ${data.riskLevel.toUpperCase()}`
      }, event);
    }
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={() => onHover(null)}
      className={`relative p-4 rounded-xl cursor-pointer ${
        isSelected ? 'bg-white/10' : 'bg-white/5'
      } hover:bg-white/10 transition-colors`}
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
          className="text-sm px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${riskColor}20`,
            color: riskColor 
          }}
        >
          {data.riskLevel}
        </motion.div>
      </motion.div>

      <motion.div 
        layout
        className="relative h-20 flex items-end gap-1 mb-4"
      >
        {data.metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className="relative flex-1"
            initial={{ height: 0 }}
            animate={{ height: `${(metric.value / 150) * 100}%` }}
            onMouseEnter={(e) => handleMetricHover(metric, e)}
            onMouseLeave={() => onHover(null)}
            transition={{
              duration: 0.5,
              delay: metric.id * 0.02,
              ease: "easeOut"
            }}
            style={{ backgroundColor: riskColor }}
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

const GlobalSecurityView: React.FC<{
  data: GeoSecurityData[];
  primaryColor: string;
  onHover: (content: TooltipProps['content'] | null, event?: React.MouseEvent) => void;
}> = ({ data, primaryColor, onHover }) => {
  const totalFailedAttempts = useMemo(() => 
    data.reduce((sum, region) => sum + region.failedAttempts, 0),
    [data]
  );

  const handleReasonHover = (reason: typeof failureReasons[0], event: React.MouseEvent) => {
    onHover({
      title: reason.reason,
      value: `${reason.percentage}%`,
      description: `${Math.round((totalFailedAttempts * reason.percentage) / 100).toLocaleString()} events`
    }, event);
  };

  const handleRegionHover = (region: GeoSecurityData, event: React.MouseEvent) => {
    onHover({
      title: region.region,
      value: `${((region.failedAttempts / totalFailedAttempts) * 100).toFixed(1)}%`,
      description: `${region.failedAttempts.toLocaleString()} failed attempts`
    }, event);
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
            className="p-4 rounded-lg bg-white/5"
            onMouseEnter={(e) => handleReasonHover(reason, e)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="text-sm text-zinc-400 mb-2">{reason.reason}</div>
            <div className="text-2xl font-bold text-white">
              {reason.percentage}%
            </div>
            <motion.div 
              className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reason.percentage}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: primaryColor }}
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
              {((region.failedAttempts / totalFailedAttempts) * 100).toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ 
  data: providedData,
  primaryColor = defaultProps.primaryColor 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showGlobal, setShowGlobal] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TooltipProps['content'] | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  
  // Combine provided data with generated security data
  const securityData = useMemo(() => {
    const generatedData = generateData();
    return generatedData.map((region, index) => ({
      ...region,
      users: providedData[index]?.users || 0,
      mfaAdoption: providedData[index]?.mfaAdoption || 0
    }));
  }, [providedData]);

  const handleTooltip = (content: TooltipProps['content'] | null, event?: React.MouseEvent) => {
    setTooltipContent(content);
    if (event) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    } else {
      setMousePosition(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltipContent) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <section 
      className="w-full h-[568px] rounded-xl p-6 bg-white/5 overflow-hidden relative"
      aria-label="Security Alerts Dashboard"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setTooltipContent(null);
        setMousePosition(null);
      }}
    >
      <button 
        className="w-full flex items-center justify-between mb-8"
        onClick={() => setShowGlobal(!showGlobal)}
        onKeyDown={(e) => e.key === 'Enter' && setShowGlobal(!showGlobal)}
      >
        <motion.h2 
          className="text-2xl font-medium text-white"
          layout
        >
          Security Alerts
        </motion.h2>
        <div className="text-sm text-zinc-400">Last 24h</div>
      </button>

      <AnimatePresence mode="wait">
        {showGlobal ? (
          <GlobalSecurityView 
            data={securityData} 
            primaryColor={primaryColor} 
            onHover={handleTooltip}
          />
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-2 gap-4"
          >
            {securityData.map((region) => (
              <RegionCard
                key={region.region}
                data={region}
                isSelected={selectedRegion === region.region}
                onHover={handleTooltip}
                onClick={() => setSelectedRegion(
                  selectedRegion === region.region ? null : region.region
                )}
                primaryColor={primaryColor}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CustomTooltip 
        active={Boolean(tooltipContent && mousePosition)}
        content={tooltipContent || { value: '', description: '' }}
        mousePosition={mousePosition}
      />
    </section>
  );
};

export default GeographicDistribution;