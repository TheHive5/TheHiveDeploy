import React from 'react';
import './styles/hive.css';

export default function App() {
    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <div className="logo">THE HIVE</div>
            </header>

            {/* Main Container - Honeycomb background fills this area */}
            <main className="main-container">
                <div className="hive-container">
                    {/* Background is pure SVG pattern on body - no elements needed */}
                </div>
            </main>
        </div>
    );
}