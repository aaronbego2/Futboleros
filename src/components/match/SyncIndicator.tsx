import { motion } from 'framer-motion';

interface SyncIndicatorProps {
  isConnected: boolean;
}

export function SyncIndicator({ isConnected }: SyncIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: isConnected ? [1, 1.2, 1] : 1,
          opacity: isConnected ? [0.5, 1, 0.5] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-[#f18904]' : 'bg-red-500'
        }`}
      />
      <span className="text-xs font-mono text-white/60">
        {isConnected ? 'En Vivo' : 'Desconectado'}
      </span>
    </div>
  );
}
