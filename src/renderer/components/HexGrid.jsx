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
      '0_0': { type: 'queen', label: 'QUEEN', color: '#FFD700' }
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
            {/* Hex fill and border */}
            <path
              d={hexPath(hex.x, hex.y, hexSize)}
              fill={isQueen || isWorker ? hex.color : '#FFEB3B'}
              fillOpacity={isQueen || isWorker ? 0.3 : 0.8}
              stroke="#DAA520"
              strokeWidth={isActive ? '2' : '1.5'}
              className="hex-outline"
              filter={isQueen ? 'url(#glowQueen)' : 'none'}
            />

            {/* Render bee for Queen or Worker */}
            {isQueen && (
              <g>
                <text x={hex.x} y={hex.y} textAnchor="middle" dy="1em" 
                      fill="#FFD700" fontSize="14" fontWeight="bold" fontFamily="monospace">
                  QUEEN
                </text>
                <circle cx={hex.x} cy={hex.y - 8} r="6" fill="#FFD700" opacity="0.8" />
              </g>
            )}

            {isWorker && (
              <g>
                <text x={hex.x} y={hex.y + 2} textAnchor="middle" dy="0em" 
                      fill={hex.color} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {hex.symbol}
                </text>
                <text x={hex.x} y={hex.y + 16} textAnchor="middle" dy="0em" 
                      fill={hex.color} fontSize="10" fontFamily="monospace" opacity="0.8">
                  {hex.name}
                </text>
                {isActive && (
                  <circle cx={hex.x} cy={hex.y} r={hexSize + 3} fill="none" 
                          stroke={hex.color} strokeWidth="2" opacity="0.6" />
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