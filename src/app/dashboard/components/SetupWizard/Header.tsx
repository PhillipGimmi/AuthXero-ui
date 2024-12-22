// components/Header.tsx
import { motion } from 'framer-motion';

export const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center space-y-4"
  >
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
      One-Click Auth Setup
    </h1>
    <p className="text-zinc-400">
      Secure authentication configured automatically
    </p>
  </motion.div>
);
