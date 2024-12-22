import React from 'react';

interface DataPoint {
  time: string;
  value: number;
  successRate?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: 'value' | 'successRate';
    value: number;
    payload: DataPoint;
  }>;
  label?: string;
  previousPeriodData: DataPoint[];
}

const CustomTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  previousPeriodData,
}) => {
  if (!active || !payload?.length || !label) return null;

  const currentPayload = payload[0];
  const currentValue = currentPayload.value;
  const previousPeriodEntry = previousPeriodData.find(
    (entry) => entry.time === label,
  );
  const previousValue = previousPeriodEntry?.value ?? 0;

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0)
      return { symbol: '→', value: 'N/A', colorClass: 'text-white' };
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return {
        symbol: '▲',
        value: change.toFixed(1),
        colorClass: 'text-green-400',
      };
    } else if (change < 0) {
      return {
        symbol: '▼',
        value: Math.abs(change).toFixed(1),
        colorClass: 'text-red-400',
      };
    }
    return { symbol: '→', value: '0', colorClass: 'text-white' };
  };

  const change = calculateChange(currentValue, previousValue);

  return (
    <div className="w-[270px] h-[270px] p-6 rounded-xl bg-[#1A1A1A] shadow-xl border border-zinc-800">
      <div className="space-y-4">
        <div className="text-base text-gray-400 text-center border-b border-zinc-800 pb-2">
          {label}
        </div>

        <div className="text-center space-y-1">
          <div className="text-7xl font-bold text-white leading-none tracking-tight">
            {currentValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Previous: {previousValue.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="text-sm text-gray-400 font-medium">Change</div>
          <div
            className={`text-sm font-medium ${change.colorClass} flex items-center gap-1.5`}
          >
            <span className="text-lg">{change.symbol}</span>
            <span>{change.value}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
