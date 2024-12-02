// components/CodePreview.tsx
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  onCopy: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, onCopy }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Quick Setup</h3>
      <button
        onClick={onCopy}
        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 
          transition-colors flex items-center gap-2 group"
      >
        <Code className="w-4 h-4" />
        <span className="group-hover:text-blue-400 transition-colors">Copy Code</span>
      </button>
    </div>
    <div className="bg-zinc-900/50 rounded-lg p-6 overflow-x-auto backdrop-blur-sm border border-zinc-800">
      <pre className="text-sm">
        <code className="text-blue-400">{code}</code>
      </pre>
    </div>
  </motion.div>
);
