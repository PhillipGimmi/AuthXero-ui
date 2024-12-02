// import React from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, LineChart,
//   Line, AreaChart, Area
// } from 'recharts';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// const COLORS = {
//   blue: '#3B82F6',
//   green: '#10B981',
//   red: '#EF4444',
//   yellow: '#F59E0B',
//   blueHover: '#2563EB'
// };

// const MetricCard = ({ title, value, trend, data }) => {
//   const isPositive = trend >= 0;

//   return (
//     <Card className="bg-black/50 backdrop-blur-sm border-white/10">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-baseline justify-between">
//           <h4 className="text-2xl font-bold text-white">
//             {typeof value === 'number' ? value.toLocaleString() : value}
//           </h4>
//           <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//             {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
//             <span className="text-sm ml-1">{Math.abs(trend)}%</span>
//           </div>
//         </div>
//         <div className="h-24 mt-4">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
//                   <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <Area
//                 type="monotone"
//                 dataKey="value"
//                 stroke={COLORS.blue}
//                 fillOpacity={1}
//                 fill="url(#colorValue)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const SecurityEventsChart = ({ data }) => {
//   return (
//     <Card className="bg-black/50 backdrop-blur-sm border-white/10">
//       <CardHeader>
//         <CardTitle className="text-white">Security Events Distribution</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-4 gap-4 mb-4">
//           {Object.entries(data)
//             .filter(([key]) => key !== 'total' && key !== 'history')
//             .map(([severity, count]) => (
//               <div key={severity} className="text-center">
//                 <div className="text-sm text-white/70 mb-1">{severity}</div>
//                 <div className="text-lg font-bold text-white">{count.toLocaleString()}</div>
//               </div>
//             ))}
//         </div>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data.history}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis
//                 dataKey="timestamp"
//                 stroke="#9CA3AF"
//                 tickFormatter={(value) => new Date(value).toLocaleDateString()}
//               />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 cursor={{ fill: 'rgba(0, 0, 0, 0)' }}
//                 contentStyle={{
//                   backgroundColor: '#1F2937',
//                   border: '1px solid #374151',
//                   borderRadius: '0.5rem',
//                   color: '#FFFFFF',
//                 }}
//                 labelFormatter={(value) => new Date(value).toLocaleDateString()}
//               />
//               <Bar
//                 dataKey="count"
//                 fill={COLORS.blue}
//                 radius={[4, 4, 0, 0]}
//                 name="Events"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const PerformanceChart = ({ data }) => {
//   return (
//     <Card className="bg-black/50 backdrop-blur-sm border-white/10">
//       <CardHeader>
//         <CardTitle className="text-white">System Performance</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           <div className="text-center">
//             <div className="text-sm text-white/70 mb-1">Uptime</div>
//             <div className="text-lg font-bold text-white">{data.uptime}%</div>
//           </div>
//           <div className="text-center">
//             <div className="text-sm text-white/70 mb-1">Response Time</div>
//             <div className="text-lg font-bold text-white">{data.responseTime}ms</div>
//           </div>
//           <div className="text-center">
//             <div className="text-sm text-white/70 mb-1">Availability</div>
//             <div className="text-lg font-bold text-white">{data.availability}%</div>
//           </div>
//         </div>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data.history}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis
//                 dataKey="timestamp"
//                 stroke="#9CA3AF"
//                 tickFormatter={(value) => new Date(value).toLocaleDateString()}
//               />
//               <YAxis
//                 stroke="#9CA3AF"
//                 domain={[99.9, 100]}
//                 tickFormatter={(value) => `${value}%`}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#1F2937',
//                   border: '1px solid #374151',
//                   borderRadius: '0.5rem',
//                   color: '#FFFFFF',
//                 }}
//                 labelFormatter={(value) => new Date(value).toLocaleDateString()}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke={COLORS.green}
//                 strokeWidth={2}
//                 dot={false}
//                 name="Performance"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const MetricsSection = ({ metrics }) => {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <MetricCard
//           title="Active Users"
//           value={metrics.activeUsers.current}
//           trend={metrics.activeUsers.trend}
//           data={metrics.activeUsers.history}
//         />
//         <MetricCard
//           title="Response Time"
//           value={`${metrics.performance.responseTime}ms`}
//           trend={-2.5}
//           data={metrics.performance.history}
//         />
//         <MetricCard
//           title="System Availability"
//           value={`${metrics.performance.availability}%`}
//           trend={0.1}
//           data={metrics.performance.history}
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SecurityEventsChart data={metrics.securityEvents} />
//         <PerformanceChart data={metrics.performance} />
//       </div>
//     </div>
//   );
// };

// export default MetricsSection;
