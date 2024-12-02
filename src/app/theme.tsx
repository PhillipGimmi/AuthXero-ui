// theme.ts
interface ThemeColors {
  primary: {
    main: string;
    hover: string;
    gradient: {
      start: string;
      end: string;
    };
  };
  secondary: {
    main: string;
    hover: string;
    gradient: {
      start: string;
      end: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  background: {
    main: string;
    surface: string;
    overlay: string;
  };
  axis: {
    stroke: string;
    tick: string;
    line: string;
  };
  grid: {
    stroke: string;
    opacity: number;
  };
  sparkle: {
    glow: string;
    standard: string;
    intense: string;
  };
  indicator: {
    success: string;
    error: string;
    neutral: string;
  };
}

// Default theme with CSS variable references
export const defaultTheme: ThemeColors = {
  primary: {
    main: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
    gradient: {
      start: 'var(--color-primary-gradient-start)',
      end: 'var(--color-primary-gradient-end)'
    }
  },
  secondary: {
    main: 'var(--color-secondary)',
    hover: 'var(--color-secondary-hover)',
    gradient: {
      start: 'var(--color-secondary-gradient-start)',
      end: 'var(--color-secondary-gradient-end)'
    }
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)'
  },
  background: {
    main: 'var(--color-background)',
    surface: 'var(--color-background-surface)',
    overlay: 'var(--color-background-overlay)'
  },
  axis: {
    stroke: 'var(--color-axis-stroke)',
    tick: 'var(--color-axis-tick)',
    line: 'var(--color-axis-line)'
  },
  grid: {
    stroke: 'var(--color-grid)',
    opacity: 0.5
  },
  sparkle: {
    glow: 'var(--color-sparkle-glow)',
    standard: 'var(--color-sparkle-standard)',
    intense: 'var(--color-sparkle-intense)'
  },
  indicator: {
    success: 'var(--color-indicator-success)',
    error: 'var(--color-indicator-error)',
    neutral: 'var(--color-indicator-neutral)'
  }
};

// Updated components with theme integration
const TimeHeader: React.FC<{ time: string }> = ({ time }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 text-center text-4xl font-bold"
      style={{
        background: `linear-gradient(to right, ${theme.text.primary}, ${theme.text.secondary})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      {time}
    </motion.div>
  );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ label, value, color, isHovered }) => {
  const theme = useTheme();
  const baseColor = color === theme.primary.main ? theme.primary : theme.secondary;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, 
          ${baseColor.gradient.start}, 
          ${baseColor.gradient.end}
        )`,
        border: `1px solid ${baseColor.hover}`,
        boxShadow: isHovered 
          ? `0 0 40px ${baseColor.hover}, 0 0 20px ${baseColor.main}, inset 0 0 20px ${baseColor.main}`
          : `0 0 20px ${baseColor.main}`,
        transform: `scale(${isHovered ? 1.03 : 1})`,
        filter: isHovered ? 'brightness(1.3) contrast(1.1)' : 'none'
      }}
    >
      <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
        {label}
      </span>
      <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </motion.div>
  );
};

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, color, trend }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative px-6 py-3 rounded-xl" 
        style={{ 
          background: theme.background.surface,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${theme.background.overlay}`
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <span style={{ color: theme.text.secondary }} className="text-sm font-medium">
            {label}
          </span>
          <span className="text-2xl font-bold" style={{ color }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {trend !== undefined && (
            <div className={`
              flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full
              ${trend >= 0 ? `bg-${theme.indicator.success}/20` : `bg-${theme.indicator.error}/20`}
              ${trend >= 0 ? `text-${theme.indicator.success}` : `text-${theme.indicator.error}`}
              text-xs font-medium
            `}>
              <span className="text-sm">
                {trend >= 0 ? '↑' : '↓'}
              </span>
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const generateGradientDefinitions = (theme: ThemeColors) => (
  <defs>
    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={theme.primary.gradient.start} stopOpacity={0.4} />
      <stop offset="95%" stopColor={theme.primary.gradient.end} stopOpacity={0.1} />
    </linearGradient>
    <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={theme.secondary.gradient.start} stopOpacity={0.4} />
      <stop offset="95%" stopColor={theme.secondary.gradient.end} stopOpacity={0.1} />
    </linearGradient>
    
    <filter id="sharpGlow">
      <feGaussianBlur stdDeviation="5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Sparkle patterns updated with theme colors */}
    <pattern id="backgroundSparklePattern" patternUnits="userSpaceOnUse" width="200" height="200">
      <circle cx="30" cy="40" r="1.5" fill={theme.sparkle.intense} filter="url(#sharpGlow)">
        <animate attributeName="r" values="1.5; 2.5; 1.5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9; 0.5; 0.9" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Add more sparkle circles with theme colors */}
    </pattern>

    {/* Add more patterns with theme colors */}
  </defs>
);

export const useActivityChartTheme = () => {
  const theme = useTheme();
  
  return {
    theme,
    gradientDefinitions: generateGradientDefinitions(theme),
    getAreaStyles: (isHovered: boolean, isUsers: boolean) => ({
      filter: isHovered ? 
        `url(#sharpGlow) drop-shadow(0 0 10px ${isUsers ? theme.primary.hover : theme.secondary.hover})` : 
        'none',
      transition: 'all 0.3s ease'
    })
  };
};

export type { ThemeColors };
export { TimeHeader, CustomTooltip, MetricDisplay };