import React, { useMemo } from 'react';

const HexGrid = ({ width = 1400, height = 900, hexSize = 50 }) => {
  // Calculate hex grid dimensions
  const hexWidth = hexSize * 2;
  const hexHeight = (Math.sqrt(3) / 2) * hexWidth;
  const vertSpacing = hexHeight * 0.75;
  const horizSpacing = hexWidth;

  // Generate grid positions
  const hexagons = useMemo(() => {
    const hexes = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate hex grid
    for (let row = -8; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        // Offset every other row for proper hex tiling
        const xOffset = row % 2 === 0 ? 0 : horizSpacing / 2;
        const x = centerX + col * horizSpacing + xOffset;
        const y = centerY + row * vertSpacing;

        // Skip hexes outside visible area
        if (x < -hexSize || x > width + hexSize || y < -hexSize || y > height + hexSize) {
          continue;
        }

        // Calculate distance from center
        const distX = x - centerX;
        const distY = y - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Determine opacity based on distance
        let opacity = 1;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        if (distance > maxDistance * 0.5) {
          opacity = Math.max(0.1, 1 - (distance - maxDistance * 0.5) / (maxDistance * 0.5));
        }

        hexes.push({
          id: `${row}-${col}`,
          x,
          y,
          row,
          col,
          distance,
          opacity
        });
      }
    }

    return hexes;
  }, [width, height, hexSize]);

  // Generate SVG path for hexagon
  const hexPath = (x, y, size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 30) * Math.PI / 180;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      points.push([px, py]);
    }
    return `M ${points.map(p => p.join(',')).join(' L ')} Z`;
  };

  return (
    <svg width={width} height={height} className="hex-grid-svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#FFC300', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {hexagons.map((hex) => (
        <g key={hex.id} className="hex-cell" opacity={hex.opacity}>
          <path
            d={hexPath(hex.x, hex.y, hexSize * 0.9)}
            fill="none"
            stroke="#FFD700"
            strokeWidth="1.5"
            className="hex-outline"
          />
        </g>
      ))}
    </svg>
  );
};

export default HexGrid;