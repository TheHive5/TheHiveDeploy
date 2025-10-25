import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAgentStore } from '../stores/agentStore';
import { HexCell } from './HexCell';
import { QueenBeeCell } from './QueenBeeCell';

export function HoneycombGrid() {
  const { status } = useAgentStore();
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  // Hexagon grid positions (center + 6 surrounding)
  const hexPositions = [
    { id: 'queen', x: 0, y: 0, size: 'large' },
    { id: 'w1', x: 1, y: 0, size: 'small' },
    { id: 'w2', x: 0.5, y: 0.87, size: 'small' },
    { id: 'w3', x: -0.5, y: 0.87, size: 'small' },
    { id: 'w4', x: -1, y: 0, size: 'small' },
    { id: 'w5', x: -0.5, y: -0.87, size: 'small' },
    { id: 'w6', x: 0.5, y: -0.87, size: 'small' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG for hex borders */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
        <defs>
          <pattern id="hexGrid" x="100" y="100" patternUnits="userSpaceOnUse">
            <path
              d="M 50,0 L 100,25 L 100,75 L 50,100 L 0,75 L 0,25 Z"
              fill="none"
              stroke="rgb(253, 185, 19)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
      </svg>

      {/* Honeycomb cells */}
      <div className="relative w-64 h-64">
        {hexPositions.map((pos) => {
          const isQueen = pos.id === 'queen';
          const worker = isQueen ? null : status.workers.find(w => w.id === pos.id);
          const x = pos.x * 100;
          const y = pos.y * 100;

          return (
            <motion.div
              key={pos.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              variants={itemVariants}
            >
              {isQueen ? (
                <QueenBeeCell status={status.queenStatus} />
              ) : (
                worker && (
                  <HexCell
                    worker={worker}
                    isSelected={selectedWorker === worker.id}
                    onClick={() => setSelectedWorker(worker.id)}
                  />
                )
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Worker details */}
      {selectedWorker && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 text-xs text-honey-900 border border-honey-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status.workers.find(w => w.id === selectedWorker)?.name}: Working on task...
        </motion.div>
      )}
    </motion.div>
  );
}