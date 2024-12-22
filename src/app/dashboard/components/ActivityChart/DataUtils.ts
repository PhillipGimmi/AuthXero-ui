export interface ChartDataPoint {
  time: string; // Time label for the data point (e.g., "00:00", "Day 1")
  logins: number; // Number of logins for this interval
  users: number; // Number of users for this interval
  avgLoginsPerUser: string; // Average logins per user for this interval
  userChange?: string; // Percentage change in users compared to the previous interval
  loginChange?: string; // Percentage change in logins compared to the previous interval
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '6m' | '1y' | 'lifetime';

export const timeRangeConfigs: Record<
  TimeRange,
  {
    minUsers: number;
    maxUsers: number;
    avgLoginsPerUser: number;
    loginsVariance: number;
  }
> = {
  '24h': {
    minUsers: 2000,
    maxUsers: 5000,
    avgLoginsPerUser: 3.5,
    loginsVariance: 0.3,
  },
  '7d': {
    minUsers: 500,
    maxUsers: 1500,
    avgLoginsPerUser: 5.0,
    loginsVariance: 0.3,
  },
  '30d': {
    minUsers: 400,
    maxUsers: 800,
    avgLoginsPerUser: 12.0,
    loginsVariance: 0.25,
  },
  '90d': {
    minUsers: 300,
    maxUsers: 600,
    avgLoginsPerUser: 25.0,
    loginsVariance: 0.25,
  },
  '6m': {
    minUsers: 200,
    maxUsers: 400,
    avgLoginsPerUser: 40.0,
    loginsVariance: 0.2,
  },
  '1y': {
    minUsers: 100,
    maxUsers: 300,
    avgLoginsPerUser: 60.0,
    loginsVariance: 0.2,
  },
  lifetime: {
    minUsers: 30,
    maxUsers: 100,
    avgLoginsPerUser: 100.0,
    loginsVariance: 0.2,
  },
};

// Generate a formatted time label for each interval based on the time range
export const formatTimeLabel = (
  index: number,
  timeRange: TimeRange,
): string => {
  switch (timeRange) {
    case '24h':
      return `${index.toString().padStart(2, '0')}:00`; // e.g., "01:00", "02:00"
    case '7d': {
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return weekdays[index % 7]; // e.g., "Mon", "Tue"
    }
    case '30d':
    case '90d':
      return `Day ${index + 1}`; // e.g., "Day 1", "Day 2"
    case '6m':
    case '1y': {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index)); // Previous months
      return date.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Jan", "Feb"
    }
    default:
      return `Period ${index + 1}`; // e.g., "Period 1", "Period 2"
  }
};

// Generate a single data point with optional comparisons to the previous data point
export const generateDataPoint = (
  index: number,
  timeRange: TimeRange,
  previousPoint?: ChartDataPoint,
): ChartDataPoint => {
  const config = timeRangeConfigs[timeRange];

  // Generate random users between min and max
  const users = Math.floor(
    Math.random() * (config.maxUsers - config.minUsers) + config.minUsers,
  );

  // Calculate logins as a multiple of users (1.5x to 3.0x)
  const loginsMultiplier = 1.5 + Math.random() * 1.5; // Range: 1.5 - 3.0
  const logins = Math.max(users + 1, Math.floor(users * loginsMultiplier)); // Always > users

  // Calculate percentage changes compared to the previous point
  const userChange =
    previousPoint && previousPoint.users > 0
      ? (((users - previousPoint.users) / previousPoint.users) * 100).toFixed(
          2,
        ) + '%'
      : null;

  const loginChange =
    previousPoint && previousPoint.logins > 0
      ? (
          ((logins - previousPoint.logins) / previousPoint.logins) *
          100
        ).toFixed(2) + '%'
      : null;

  return {
    time: formatTimeLabel(index, timeRange),
    users,
    logins,
    avgLoginsPerUser: (logins / users).toFixed(2), // Average logins per user
    userChange: userChange ?? 'N/A',
    loginChange: loginChange ?? 'N/A',
  };
};

// Generate data for the entire time range, with comparisons for each interval
export const generateTimeBasedData = (
  timeRange: TimeRange,
): ChartDataPoint[] => {
  let totalIntervals: number;

  // Define the total number of intervals based on the time range
  switch (timeRange) {
    case '24h':
      totalIntervals = 24; // 24 hours
      break;
    case '7d':
      totalIntervals = 7; // 7 days
      break;
    case '30d':
      totalIntervals = 30; // 30 days
      break;
    case '90d':
      totalIntervals = 90; // 90 days
      break;
    case '6m':
      totalIntervals = 6; // 6 months
      break;
    case '1y':
      totalIntervals = 12; // 12 months
      break;
    case 'lifetime':
      totalIntervals = 10; // 10 custom periods
      break;
    default:
      totalIntervals = 24; // Default to 24 hours
  }

  const data: ChartDataPoint[] = [];
  for (let i = 0; i < totalIntervals; i++) {
    const previousPoint = i > 0 ? data[i - 1] : undefined; // Fetch previous point for comparisons
    data.push(generateDataPoint(i, timeRange, previousPoint));
  }
  return data;
};

// Ensure the dataset is complete and aligns with the time range intervals
export const ensureCompleteData = (
  data: ChartDataPoint[],
  timeRange: TimeRange,
): ChartDataPoint[] => {
  let intervals: number;

  // Determine the expected number of intervals
  switch (timeRange) {
    case '24h':
      intervals = 24;
      break;
    case '7d':
      intervals = 7;
      break;
    case '30d':
      intervals = 30;
      break;
    case '90d':
      intervals = 90;
      break;
    case '6m':
      intervals = 6;
      break;
    case '1y':
      intervals = 12;
      break;
    case 'lifetime':
      intervals = 10;
      break;
    default:
      intervals = 24;
  }

  const fullData: ChartDataPoint[] = [];
  for (let i = 0; i < intervals; i++) {
    const timeLabel = formatTimeLabel(i, timeRange);
    const existingPoint = data.find((d) => d.time === timeLabel);

    if (existingPoint) {
      fullData.push(existingPoint);
    } else {
      const previousPoint = fullData[fullData.length - 1] || {
        users: 0,
        logins: 0,
        time: timeLabel,
      };
      fullData.push({
        time: timeLabel,
        users: previousPoint.users,
        logins: previousPoint.logins,
        avgLoginsPerUser: '0.00',
        userChange: 'N/A',
        loginChange: 'N/A',
      });
    }
  }
  return fullData;
};
