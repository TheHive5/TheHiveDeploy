import React, { useMemo } from 'react';
import GeometricBee from './GeometricBee';

const HexGrid = ({ 
  width = 1400, 
  height = 900, 
  hexSize = 50,
  onSelectAgent = () => {},
  activeAgent = null,
  workers = []
}) => {
  // Perfect hex tessellation math for FLAT-TOP hexagons (like beehive reference)
  // Hexagons are wider than they are tall, touching on all 6 sides
  const horizSpacing = hexSize * 1.5;  // 1.5 * hexSize (horizontal spacing)
  const vertSpacing = hexSize * Math.sqrt(3);  // 1.732 * hexSize (vertical spacing)

  // Generate grid positions
  const hexagons = useMemo(() => {
    const hexes = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Create map of special positions (Queen and Workers)
    const specialPositions = {
      '0_0': { type: 'queen', label: 'QUEEN', color: '#FFD700', isQueen: true }
    };

    workers.forEach(worker => {
      specialPositions[`${worker.hex.row}_${worker.hex.col}`] = {
        type: 'worker',
        id: worker.id,
        name: worker.name,
        color: worker.color,
        symbol: worker.symbol
      };
    });

    // Generate hex grid - touching each other with no gaps
    for (let row = -10; row <= 10; row++) {
      for (let col = -10; col <= 10; col++) {
        // Offset every other COLUMN for perfect hex tiling (flat-top)
        const yOffset = col % 2 === 0 ? 0 : vertSpacing / 2;
        const x = centerX + col * horizSpacing;
        const y = centerY + row * vertSpacing + yOffset;

        // Skip hexes way outside visible area
        if (x < -hexSize * 2 || x > width + hexSize * 2 || y < -hexSize * 2 || y > height + hexSize * 2) {
          continue;
        }

        // Calculate distance from center
        const distX = x - centerX;
        const distY = y - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Determine opacity based on distance
        let opacity = 1;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        if (distance > maxDistance * 0.4) {
          opacity = Math.max(0.15, 1 - (distance - maxDistance * 0.4) / (maxDistance * 0.4));
        }

        const isSpecial = specialPositions[`${row}_${col}`];
        
        hexes.push({
          id: `${row}_${col}`,
          x,
          y,
          row,
          col,
          distance,
          opacity,
          ...isSpecial
        });
      }
    }

    return hexes;
  }, [width, height, hexSize, workers]);

  // Generate SVG path for FLAT-TOP hexagons (wider than tall, like honeycomb reference)
  const hexPath = (x, y, size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      // Flat-top hexagon: start at 0° and increment by 60° (wide orientation)
      const angle = (i * 60) * Math.PI / 180;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      points.push([px, py]);
    }
    return `M ${points.map(p => p.join(',')).join(' L ')} Z`;
  };

  // Helper function to generate hexagon points for bee rendering
  const generateHexPoints = (cx, cy, radius) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <svg width={width} height={height} className="hex-grid-svg" style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#FFC300', stopOpacity: 0.1 }} />
        </linearGradient>
        <filter id="glowQueen">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {hexagons.map((hex) => {
        const isQueen = hex.type === 'queen';
        const isWorker = hex.type === 'worker';
        const isActive = activeAgent === hex.id && isWorker;

        return (
          <g 
            key={hex.id} 
            className="hex-cell"
            opacity={hex.opacity}
            style={{ cursor: isWorker ? 'pointer' : 'default' }}
            onClick={() => isWorker && onSelectAgent(hex.id)}
          >
            {/* Hex fill and border - bright golden yellow like honeycomb */}
            <path
              d={hexPath(hex.x, hex.y, hexSize)}
              fill={isQueen || isWorker ? hex.color : '#FFC107'}
              fillOpacity={isQueen ? 0.9 : (isWorker ? 0.4 : 0.9)}
              stroke="#5C4033"
              strokeWidth={isActive ? '3' : (isQueen ? '2.5' : '2')}
              className="hex-outline"
              filter={isQueen ? 'url(#glowQueen)' : 'none'}
            />

            {/* Queen with prominent rendering */}
            {isQueen && (
              <g>
                {/* Queen body - multiple hexagons for emphasis */}
                <circle cx={hex.x} cy={hex.y} r={hexSize * 0.6} fill="#FFD700" fillOpacity="0.8" />
                <circle cx={hex.x} cy={hex.y} r={hexSize * 0.4} fill="#5C4033" fillOpacity="0.6" />
                <circle cx={hex.x} cy={hex.y} r={hexSize * 0.2} fill="#FFD700" fillOpacity="1" />
                
                {/* Queen label */}
                <text x={hex.x} y={hex.y + hexSize + 18} textAnchor="middle" dy="0em" 
                      fill="#5C4033" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  QUEEN
                </text>
              </g>
            )}

            {/* Worker with GeometricBee icon */}
            {isWorker && (
              <g>
                {/* Render the geometric bee SVG directly */}
                <foreignObject x={hex.x - hexSize * 0.5} y={hex.y - hexSize * 0.5} 
                              width={hexSize} height={hexSize}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <svg viewBox="0 0 100 120" width={hexSize * 0.8} height={hexSize * 0.95} className="geometric-bee">
                      {/* Body - Central hexagon */}
                      <polygon points={generateHexPoints(50, 60, 15)} fill={hex.color} stroke="#5C4033" strokeWidth="1.5" opacity="0.9" />
                      
                      {/* Head - Top hexagon */}
                      <polygon points={generateHexPoints(50, 30, 12)} fill={hex.color} stroke="#5C4033" strokeWidth="1.5" opacity="1" />
                      
                      {/* Connection line */}
                      <line x1="50" y1="42" x2="50" y2="48" stroke={hex.color} strokeWidth="2" />
                      
                      {/* Left Wing */}
                      <polygon points={generateHexPoints(25, 50, 10)} fill={hex.color} stroke="#5C4033" strokeWidth="1.5" opacity="0.6" />
                      
                      {/* Right Wing */}
                      <polygon points={generateHexPoints(75, 50, 10)} fill={hex.color} stroke="#5C4033" strokeWidth="1.5" opacity="0.6" />
                      
                      {/* Antennae */}
                      <line x1="45" y1="20" x2="35" y2="5" stroke={hex.color} strokeWidth="2" />
                      <line x1="55" y1="20" x2="65" y2="5" stroke={hex.color} strokeWidth="2" />
                      
                      {/* Legs */}
                      <line x1="40" y1="75" x2="30" y2="95" stroke={hex.color} strokeWidth="2" />
                      <line x1="50" y1="75" x2="50" y2="100" stroke={hex.color} strokeWidth="2" />
                      <line x1="60" y1="75" x2="70" y2="95" stroke={hex.color} strokeWidth="2" />
                    </svg>
                  </div>
                </foreignObject>

                {/* Worker name below */}
                <text x={hex.x} y={hex.y + hexSize + 16} textAnchor="middle" dy="0em" 
                      fill="#5C4033" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {hex.name}
                </text>

                {/* Active indicator circle */}
                {isActive && (
                  <circle cx={hex.x} cy={hex.y} r={hexSize * 0.75} fill="none" 
                          stroke={hex.color} strokeWidth="2.5" opacity="0.8" />
                )}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default HexGrid;