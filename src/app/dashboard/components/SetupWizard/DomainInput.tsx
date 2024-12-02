// components/DomainInput.tsx
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface DomainInputProps {
  domain: string;
  onChange: (value: string) => void;
}

export const DomainInput: React.FC<DomainInputProps> = ({ domain, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <label 
      htmlFor="application-domain"
      className="block text-sm font-medium text-zinc-400"
    >
      Application Domain
    </label>
    <div className="relative">
      <input
        id="application-domain"
        type="text"
        value={domain}
        onChange={(e) => onChange(e.target.value)}
        placeholder="your-app-domain.com"
        className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none
          transition-all duration-200"
      />
      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
    </div>
  </motion.div>
);
