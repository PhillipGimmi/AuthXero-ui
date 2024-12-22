import React from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

interface TerminalLineProps {
  text: string;
  index: number;
  isCommand?: boolean;
}

const TerminalLine = ({
  text,
  index,
  isCommand = false,
}: TerminalLineProps) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: isCommand ? 0 : index * 0.1 }}
    className="text-slate-300 mb-3 flex items-start"
  >
    <span className="text-green-400 mr-2 font-mono">→</span>
    {isCommand ? (
      <span className="whitespace-pre-wrap">{text}</span>
    ) : (
      <TypewriterText text={text} />
    )}
  </motion.div>
);

export default TerminalLine;
