"use client";

import React from "react";
import { motion } from "framer-motion";
import ChartCard from "@/app/dashboard/components/ChartCard/ChartCard";
import ActivityChart from "@/app/dashboard/components/ActivityChart/ActivityChart";
import AuthMethodsChart from "@/app/dashboard/components/AuthMethodsChart/AuthMethodsChart";
import GeographicDistribution from "@/app/dashboard/components/GeographicDistribution/GeographicDistribution";

// Dummy data for ActivityChart
const activityChartData = Array.from({ length: 48 }, (_, index) => {
  const users = 1000 + Math.floor(Math.random() * 500); // Random users between 1000-1500
  const logins = Math.floor(users * (0.3 + Math.random() * 0.2)); // Logins between 30%-50% of users
  const time = `${String(index % 24).padStart(2, '0')}:00`; // Time labels

  return { time, users, logins };
});

const ChartsGrid: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      whileHover={{ scale: 1.01, rotateX: 1, rotateY: 1 }}
      className="lg:col-span-2"
    >
      <ChartCard
        title="Authentication Activity"
        subtitle="Real-time monitoring of authentication events"
        chart={<ActivityChart data={activityChartData} timeRange={"24h"} />} // Pass dummy data here
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01, rotateX: 1, rotateY: 1 }}
    >
      <ChartCard
        title="Authentication Methods"
        subtitle="Security distribution across your platform"
        chart={
          <AuthMethodsChart
            data={[
              { id: "pwd", name: "Password", value: 45, trend: -5 },
              { id: "2fa", name: "2FA", value: 30, trend: 8 },
              { id: "sso", name: "SSO", value: 25, trend: 12 },
            ]}
          />
        }
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01, rotateX: 1, rotateY: 1 }}
    >
      <ChartCard
        title="Geographic Coverage"
        subtitle="Global authentication patterns"
        chart={
          <GeographicDistribution
            data={[
              { country: "United States", users: 5240, mfaAdoption: 82 },
              { country: "United Kingdom", users: 2120, mfaAdoption: 76 },
              { country: "Germany", users: 1890, mfaAdoption: 85 },
            ]}
          />
        }
      />
    </motion.div>
  </div>
);

export default ChartsGrid;
