import React from 'react';

interface DataPoint {
  time: string;
  users: number;
  logins: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: DataPoint;
  }>;
  label?: string;
  hoveredKey: "users" | "logins" | null;
  previousPeriodData: DataPoint[];
}

const GraphTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  hoveredKey,
  previousPeriodData
}) => {
  if (!active || !payload?.length || !hoveredKey) return null;

  const currentPayload = payload.find(p => p.dataKey === hoveredKey);
  if (!currentPayload) return null;

  const previousPeriodEntry = previousPeriodData.find(entry => entry.time === label);
  if (!previousPeriodEntry) return null;

  const currentValue = currentPayload.value;
  const previousValue = previousPeriodEntry[hoveredKey];

  const calculateChange = (current: number, previous: number): {
    symbol: "▲" | "▼" | "→";
    value: string;
    color: string;
  } => {
    if (previous === 0) return { symbol: "→", value: "0", color: "#9CA3AF" };

    const change = ((current - previous) / previous) * 100;
    
    if (change > 0) {
      return {
        symbol: "▲",
        value: Math.abs(change).toFixed(1),
        color: "#4ADE80" // Green-400 equivalent
      };
    }
    if (change < 0) {
      return {
        symbol: "▼",
        value: Math.abs(change).toFixed(1),
        color: "#F87171" // Red-400 equivalent
      };
    }
    return {
      symbol: "→",
      value: "0",
      color: "#9CA3AF"
    };
  };

  const change = calculateChange(currentValue, previousValue);

  return (
    <div className="w-[220px] p-4 rounded-lg bg-[#1A1A1A] shadow-lg">
      <div className="text-sm text-gray-400 mb-1 text-center">{label}</div>
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-1 leading-tight">
          {currentValue.toLocaleString()}
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center">
        Previous: {previousValue.toLocaleString()}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-400 capitalize">{hoveredKey}</div>
        <div className="text-sm font-medium flex items-center gap-1" style={{ color: change.color }}>
          <span>{change.symbol}</span>
          <span>{change.value}%</span>
        </div>
      </div>
    </div>
  );
};

export default GraphTooltip;