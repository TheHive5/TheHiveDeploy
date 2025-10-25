import React from 'react';
import { motion } from 'framer-motion';

/**
 * Geometric Bee - Pure hexagonal/angular design
 * No curves, faces, or emoji
 */
const GeometricBee = ({ size = 40, isActive = false, type = 'worker', color = '#FFD700' }) => {
  const hexSize = size / 3;

  // Bee SVG using only hexagons and lines
  const BeeShape = () => (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      className="geometric-bee"
      style={{ display: 'block' }}
    >
      {/* Body - Central hexagon */}
      <polygon
        points={generateHexPoints(50, 60, 15)}
        fill={color}
        stroke="#1a1410"
        strokeWidth="1"
        opacity="0.9"
      />

      {/* Head - Top hexagon */}
      <polygon
        points={generateHexPoints(50, 30, 12)}
        fill={color}
        stroke="#1a1410"
        strokeWidth="1"
        opacity="1"
      />

      {/* Connection line */}
      <line x1="50" y1="42" x2="50" y2="48" stroke={color} strokeWidth="2" />

      {/* Left Wing - Angular hexagon cluster */}
      <polygon
        points={generateHexPoints(25, 50, 10)}
        fill={color}
        stroke="#1a1410"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Right Wing - Angular hexagon cluster */}
      <polygon
        points={generateHexPoints(75, 50, 10)}
        fill={color}
        stroke="#1a1410"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Antennae - Straight angular lines */}
      <line x1="45" y1="20" x2="35" y2="5" stroke={color} strokeWidth="2" />
      <line x1="55" y1="20" x2="65" y2="5" stroke={color} strokeWidth="2" />

      {/* Legs - Angular segments */}
      <line x1="40" y1="75" x2="30" y2="95" stroke={color} strokeWidth="2" />
      <line x1="50" y1="75" x2="50" y2="100" stroke={color} strokeWidth="2" />
      <line x1="60" y1="75" x2="70" y2="95" stroke={color} strokeWidth="2" />
    </svg>
  );

  // Generate hexagon points
  function generateHexPoints(cx, cy, radius) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }

  const variants = {
    idle: {
      rotate: 0,
      scale: 1
    },
    buzz: {
      rotate: [0, -2, 2, -2, 0],
      y: [0, -2, 0, -2, 0]
    },
    active: {
      scale: 1.15,
      filter: `drop-shadow(0 0 12px ${color})`
    }
  };

  return (
    <motion.div
      className="geometric-bee-container"
      variants={variants}
      initial="idle"
      animate={isActive ? 'active' : 'buzz'}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <BeeShape />
    </motion.div>
  );
};

export default GeometricBee;