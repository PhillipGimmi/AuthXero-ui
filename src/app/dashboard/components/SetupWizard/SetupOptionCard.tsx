// components/SetupOptionCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './SetupWizard.module.css';
import { SetupOption } from './types';

interface SetupOptionCardProps {
  option: SetupOption;
  isSelected: boolean;
  onSelect: () => void;
  mousePosition: { x: number; y: number } | undefined;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onMouseLeave: () => void;
}

export const SetupOptionCard: React.FC<SetupOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  mousePosition = { x: 0, y: 0 },
  onMouseMove,
  onTouchMove,
  onMouseLeave,
}) => {
  const Icon = option.icon;

  return (
    <motion.button
      onClick={onSelect}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseLeave={onMouseLeave}
      data-state={isSelected ? "selected" : "default"}
      className={`${styles.setupOption} ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-zinc-800 hover:border-zinc-700'
      } border transition-all group backdrop-blur-sm`}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
      whileHover={{ translateY: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.highlight} />
      <div className={`${styles.content} p-6`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            isSelected
              ? 'bg-blue-500'
              : 'bg-zinc-800 group-hover:bg-zinc-700'
          } transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-semibold text-lg">{option.title}</h3>
            <p className="text-zinc-400 text-sm mt-1">{option.description}</p>
          </div>
          <ArrowRight className={`w-5 h-5 transition-transform ${
            isSelected ? 'translate-x-1' : ''
          }`} />
        </div>
      </div>
    </motion.button>
  );
};
