import React from 'react';
import './styles/hive.css';

// Generate a 20x20 honeycomb grid (400 hexes)
const generateHexGrid = () => {
    const grid = [];
    for (let i = 0; i < 400; i++) {
        grid.push({ gridId: i });
    }
    return grid;
};

export default function App() {
    const hexGrid = generateHexGrid();

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <div className="logo">THE HIVE</div>
            </header>

            {/* Main Container */}
            <main className="main-container">
                {/* Central Hive Grid - Glowing hexagon background */}
                <div className="hive-container">
                    <div className="hive-grid">
                        {hexGrid.map((cell) => (
                            <div
                                key={cell.gridId}
                                className="hex-cell"
                                data-grid-id={cell.gridId}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}