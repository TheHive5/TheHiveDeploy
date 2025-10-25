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
          <stop offset="0%" style={{ stopColor: '#FDE8C8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F5E6D3', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glowQueen">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
            {/* Hex fill and border - professional honeycomb palette */}
            <path
              d={hexPath(hex.x, hex.y, hexSize)}
              fill={isQueen ? '#E8D5B7' : (isWorker ? '#F9F3E6' : '#FDE8C8')}
              fillOpacity={isQueen ? 1 : (isWorker ? 0.85 : 0.95)}
              stroke={isQueen ? '#8B4513' : (isWorker ? '#A0826D' : '#8B6F47')}
              strokeWidth={isActive ? '3' : (isQueen ? '3' : '2')}
              className="hex-outline"
              filter={isQueen ? 'url(#glowQueen)' : 'none'}
            />

            {/* Queen with bee shape + crown */}
            {isQueen && (
              <g>
                <foreignObject x={hex.x - hexSize * 0.55} y={hex.y - hexSize * 0.65} 
                              width={hexSize * 1.1} height={hexSize * 1.3}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <svg viewBox="0 0 100 140" width={hexSize * 0.95} height={hexSize * 1.2} className="queen-bee">
                      {/* Crown - 5 pointed crown */}
                      {/* Left spike */}
                      <polygon points="15,10 10,22 20,18" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      {/* Center-left spike */}
                      <polygon points="30,5 25,18 35,15" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      {/* Center spike (highest) */}
                      <polygon points="50,0 45,16 55,16" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      {/* Center-right spike */}
                      <polygon points="70,5 65,15 75,18" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      {/* Right spike */}
                      <polygon points="85,10 80,18 90,22" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      {/* Crown band */}
                      <ellipse cx="50" cy="22" rx="38" ry="8" fill="none" stroke="#8B6914" strokeWidth="1.5" opacity="0.8" />
                      
                      {/* Antennae - longer and more pronounced */}
                      <line x1="35" y1="28" x2="25" y2="10" stroke="#2C1810" strokeWidth="2.5" />
                      <line x1="65" y1="28" x2="75" y2="10" stroke="#2C1810" strokeWidth="2.5" />
                      {/* Antenna tips */}
                      <circle cx="25" cy="10" r="2" fill="#2C1810" />
                      <circle cx="75" cy="10" r="2" fill="#2C1810" />
                      
                      {/* Head */}
                      <circle cx="50" cy="35" r="11" fill="#1A1410" stroke="#8B4513" strokeWidth="1.5" opacity="0.95" />
                      
                      {/* Eyes */}
                      <circle cx="45" cy="33" r="2" fill="#FFD700" opacity="0.8" />
                      <circle cx="55" cy="33" r="2" fill="#FFD700" opacity="0.8" />
                      
                      {/* Thorax/Body - 3 body segments */}
                      {/* Upper body segment */}
                      <ellipse cx="50" cy="55" rx="14" ry="12" fill="#D4691C" stroke="#8B4513" strokeWidth="2" />
                      {/* Middle body segment with stripes */}
                      <ellipse cx="50" cy="75" rx="16" ry="14" fill="#B84919" stroke="#8B4513" strokeWidth="2" />
                      <line x1="40" y1="72" x2="60" y2="72" stroke="#2C1810" strokeWidth="1" opacity="0.6" />
                      <line x1="38" y1="78" x2="62" y2="78" stroke="#2C1810" strokeWidth="1" opacity="0.6" />
                      {/* Lower body segment */}
                      <ellipse cx="50" cy="95" rx="12" ry="11" fill="#D4691C" stroke="#8B4513" strokeWidth="2" />
                      
                      {/* Left Wing */}
                      <ellipse cx="30" cy="60" rx="9" ry="14" fill="#C85A1B" stroke="#8B4513" strokeWidth="1.5" opacity="0.7" transform="rotate(-25 30 60)" />
                      
                      {/* Right Wing */}
                      <ellipse cx="70" cy="60" rx="9" ry="14" fill="#C85A1B" stroke="#8B4513" strokeWidth="1.5" opacity="0.7" transform="rotate(25 70 60)" />
                      
                      {/* Front legs (3 pairs) */}
                      {/* Left front leg */}
                      <line x1="42" y1="105" x2="30" y2="125" stroke="#2C1810" strokeWidth="2.5" />
                      {/* Center-left leg */}
                      <line x1="48" y1="106" x2="45" y2="128" stroke="#2C1810" strokeWidth="2.5" />
                      {/* Center-right leg */}
                      <line x1="52" y1="106" x2="55" y2="128" stroke="#2C1810" strokeWidth="2.5" />
                      {/* Right front leg */}
                      <line x1="58" y1="105" x2="70" y2="125" stroke="#2C1810" strokeWidth="2.5" />
                      
                      {/* Leg joints */}
                      <circle cx="30" cy="125" r="1.5" fill="#2C1810" />
                      <circle cx="45" cy="128" r="1.5" fill="#2C1810" />
                      <circle cx="55" cy="128" r="1.5" fill="#2C1810" />
                      <circle cx="70" cy="125" r="1.5" fill="#2C1810" />
                    </svg>
                  </div>
                </foreignObject>
                
                {/* Queen label */}
                <text x={hex.x} y={hex.y + hexSize + 22} textAnchor="middle" dy="0em" 
                      fill="#8B4513" fontSize="11" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
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