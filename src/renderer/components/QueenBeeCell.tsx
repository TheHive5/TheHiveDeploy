import React from 'react';
import { motion } from 'framer-motion';

interface QueenBeeCellProps {
  status: string;
}

export function QueenBeeCell({ status }: QueenBeeCellProps) {
  const queenVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      boxShadow: '0 8px 16px rgba(253, 185, 19, 0.2)',
    },
    active: {
      scale: 1.08,
      boxShadow: '0 0 30px rgba(253, 185, 19, 0.9)',
    },
  };

  const isActive = status !== 'Idle';

  return (
    <motion.div
      className={`
        w-32 h-32 rounded-2xl
        bg-gradient-to-br from-honey-300 via-honey-200 to-amber-300
        border-3 border-honey-500
        flex items-center justify-center
        flex-col gap-2 shadow-2xl
        cursor-default select-none
      `}
      animate={isActive ? 'active' : 'idle'}
      variants={queenVariants}
      transition={{
        duration: isActive ? 1.5 : 0.3,
        repeat: isActive ? Infinity : 0,
      }}
    >
      {/* Queen icon */}
      <motion.div
        className="text-5xl"
        animate={{ rotate: isActive ? 360 : 0 }}
        transition={{
          duration: isActive ? 3 : 0,
          repeat: isActive ? Infinity : 0,
          ease: 'linear',
        }}
      >
        👑
      </motion.div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-sm font-bold text-honey-900">Queen</p>
        <motion.p
          className="text-xs text-honey-700 font-semibold"
          animate={{ opacity: isActive ? [0.6, 1, 0.6] : 1 }}
          transition={{
            duration: isActive ? 2 : 0,
            repeat: isActive ? Infinity : 0,
          }}
        >
          {status}
        </motion.p>
      </div>

      {/* Decorative aura */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-honey-400"
          animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
}