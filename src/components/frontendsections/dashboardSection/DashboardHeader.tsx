'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: '-100px' }}
    transition={{ duration: 0.6 }}
    className="text-center mb-20"
  >
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
      Powerful Authentication Dashboard
    </h2>
    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
      Real-time insights and analytics for your authentication system. Automatic
      monitoring, user trends, and detailed dashboards included.
    </p>
  </motion.div>
);

export default DashboardHeader;
