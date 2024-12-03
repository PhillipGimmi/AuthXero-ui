import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AuthMethod {
  id: string;
  name: string;
  value: number;
  timeData: Array<{
    time: string;
    value: number;
    previousValue: number;
  }>;
}

interface AuthMethodsChartProps {
  data: Array<{
    id: string;
    name: string;
    value: number;
    trend: number;
  }>;
  primaryColor?: string;
  secondaryColor?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: {
      time: string;
      value: number;
      previousValue: number;
    };
  }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const currentValue = payload[0].value;
  const previousValue = payload[0].payload.previousValue;

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { symbol: '▲', value: change.toFixed(1), class: 'text-green-400' };
    if (change < 0) return { symbol: '▼', value: Math.abs(change).toFixed(1), class: 'text-red-400' };
    return { symbol: '→', value: '0.0', class: 'text-white' };
  };

  const change = calculateChange(currentValue, previousValue);

  return (
    <div className="w-[220px] p-4 rounded-lg bg-[#1A1A1A] shadow-lg border border-zinc-800">
      <div className="text-sm text-zinc-400 mb-1 text-center">{label}</div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="text-6xl font-bold text-white mb-1 leading-tight">
          {currentValue.toFixed(1)}%
        </div>
      </motion.div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-zinc-400">Authentication Rate</div>
        <div className={`text-sm font-medium ${change.class} flex items-center gap-1`}>
          <span>{change.symbol}</span>
          <span>{change.value}%</span>
        </div>
      </div>
    </div>
  );
};

const generateTimeData = (baseValue: number, variance: number) => {
  return Array.from({ length: 24 }, (_, i) => {
    const currentValue = baseValue + Math.random() * variance;
    const previousValue = currentValue * (0.85 + Math.random() * 0.3);
    return {
      time: `${i.toString().padStart(2, '0')}:00`,
      value: Number(currentValue.toFixed(1)),
      previousValue: Number(previousValue.toFixed(1)),
    };
  });
};

const formatHour = (hour: string) => {
  const h = parseInt(hour);
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h === 23 ? '11pm' : '';
};

const AuthMethodsChart: React.FC<AuthMethodsChartProps> = ({
  data,
  primaryColor = '#22C55E',
  secondaryColor = '#9CA3AF',
}) => {
  const authMethods: AuthMethod[] = useMemo(
    () =>
      data.map((method: { id: string; name: string; value: number }) => ({
        id: method.id,
        name: method.name,
        value: Number(method.value.toFixed(1)),
        timeData: generateTimeData(method.value, 5),
      })),
    [data]
  );

  const [selectedMethod, setSelectedMethod] = useState(authMethods[0].id);
  const selectedData = authMethods.find((m) => m.id === selectedMethod);

  const chartDomain = useMemo(() => {
    if (!selectedData) return [0, 100];
    const values = selectedData.timeData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2;
    return [
      Number((Math.max(0, min - padding)).toFixed(1)), 
      Number((max + padding).toFixed(1))
    ];
  }, [selectedData]);

  return (
    <section className="flex flex-col w-full h-[568px] rounded-xl bg-white/5 p-6">
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          key={selectedData?.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-medium text-white"
        >
          {selectedData?.name}
        </motion.h2>
        <motion.div
          key={selectedData?.value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
          style={{ color: primaryColor }}
        >
          {selectedData?.value.toFixed(1)}%
        </motion.div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedData?.timeData}
            margin={{ top: 10, right: 10, bottom: 20, left: 15 }}
          >
            <XAxis
              dataKey="time"
              tick={{ fill: secondaryColor }}
              ticks={['00:00', '12:00', '23:00']}
              tickFormatter={formatHour}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={chartDomain}
              tick={{ fill: secondaryColor }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {authMethods.map((method) => (
          <motion.button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              selectedMethod === method.id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg text-white mb-2">{method.name}</span>
            <motion.span className="text-2xl font-bold">
              {method.value.toFixed(1)}%
            </motion.span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default AuthMethodsChart;