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

  return (
    <svg width={width} height={height} className="hex-grid-svg" style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}>
      <defs>
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
        
        // Palette colors from reference image
        const colors = {
          honey: '#D4A82A',      // Background
          copper: '#D97C3E',     // Queen & worker fills
          chestnut: '#A84D2C',   // Outlines
          cocoa: '#663333',      // Text & inactive cells
          darkBrown: '#3D2B2B'   // Accents
        };

        // Determine fill and stroke colors
        let fillColor = colors.cocoa;    // Default for empty cells
        let strokeColor = colors.chestnut;
        
        if (isQueen) {
          fillColor = colors.copper;
          strokeColor = colors.chestnut;
        } else if (isWorker) {
          fillColor = hex.color || colors.copper;
          strokeColor = colors.chestnut;
        }

        return (
          <g 
            key={hex.id} 
            className="hex-cell"
            opacity={hex.opacity}
            style={{ cursor: isWorker ? 'pointer' : 'default' }}
            onClick={() => isWorker && onSelectAgent(hex.id)}
          >
            {/* Hexagon cell */}
            <path
              d={hexPath(hex.x, hex.y, hexSize)}
              fill={fillColor}
              fillOpacity={isQueen ? 1 : (isWorker ? 0.9 : 0.7)}
              stroke={strokeColor}
              strokeWidth={isActive ? '3' : '2.5'}
              className="hex-outline"
              filter={isQueen ? 'url(#glowQueen)' : 'none'}
            />

            {/* Text label INSIDE hexagon */}
            {isQueen && (
              <text 
                x={hex.x} 
                y={hex.y + 8} 
                textAnchor="middle" 
                dominantBaseline="central"
                fill={colors.honey}
                fontSize={hexSize * 0.4}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                letterSpacing="1"
              >
                QUEEN
              </text>
            )}

            {isWorker && (
              <text 
                x={hex.x} 
                y={hex.y + 6} 
                textAnchor="middle" 
                dominantBaseline="central"
                fill={colors.honey}
                fontSize={hexSize * 0.32}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {hex.name}
              </text>
            )}

            {/* Active indicator glow */}
            {isActive && (
              <circle cx={hex.x} cy={hex.y} r={hexSize * 0.8} fill="none" 
                      stroke={colors.copper} strokeWidth="3" opacity="0.6" />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default HexGrid;