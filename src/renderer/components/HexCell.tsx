import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, PenTool, Search, Bug, CheckCircle } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'completed';
  currentTask?: string;
}

interface HexCellProps {
  worker: Worker;
  isSelected: boolean;
  onClick: () => void;
}

const workerIcons: Record<string, React.ReactNode> = {
  Planner: <Zap size={20} />,
  Researcher: <Search size={20} />,
  Writer: <PenTool size={20} />,
  Analyst: <BookOpen size={20} />,
  Debugger: <Bug size={20} />,
  Validator: <CheckCircle size={20} />,
};

const statusColors = {
  idle: 'from-honey-100 to-honey-200 text-honey-700 border-honey-300',
  working: 'from-amber-200 to-amber-300 text-amber-900 border-amber-400 animate-bee-pulse',
  completed: 'from-green-100 to-green-200 text-green-700 border-green-300',
};

export function HexCell({ worker, isSelected, onClick }: HexCellProps) {
  const colorClass = statusColors[worker.status];

  const cellVariants = {
    idle: { scale: 1, boxShadow: '0 4px 6px rgba(253, 185, 19, 0.1)' },
    working: {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(253, 185, 19, 0.8)',
    },
    completed: {
      scale: 1,
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        w-24 h-24 rounded-xl
        bg-gradient-to-br ${colorClass}
        border-2 transition-all duration-300
        flex items-center justify-center
        flex-col gap-1 shadow-lg
        hover:shadow-xl hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-honey-400
        ${isSelected ? 'ring-2 ring-honey-400 scale-110' : ''}
      `}
      animate={worker.status}
      variants={cellVariants}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-2xl">{workerIcons[worker.name]}</div>
      <div className="text-center">
        <p className="text-xs font-semibold leading-tight">{worker.name}</p>
        <p className="text-xs opacity-70">{worker.status}</p>
      </div>

      {/* Status indicator dot */}
      <motion.div
        className={`
          absolute -top-2 -right-2 w-4 h-4 rounded-full
          ${worker.status === 'idle' ? 'bg-gray-300' : worker.status === 'working' ? 'bg-amber-400' : 'bg-green-400'}
        `}
        animate={worker.status === 'working' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.button>
  );
}