import React, { useState, useRef } from 'react';
import './styles/hive.css';

// Sample mod data - 8 mods that will fill specific hex positions
const mockMods = [
    { id: 1, name: "OptiFine", status: "stable", type: "Performance" },
    { id: 2, name: "JourneyMap", status: "stable", type: "Utility" },
    { id: 3, name: "JEI", status: "warning", type: "Utility" },
    { id: 4, name: "Biomes O' Plenty", status: "stable", type: "World Gen" },
    { id: 5, name: "Fabric API", status: "critical", type: "Core" },
    { id: 6, name: "Sodium", status: "stable", type: "Performance" },
    { id: 7, name: "Iron Chests", status: "stable", type: "Storage" },
    { id: 8, name: "Waystones", status: "warning", type: "Utility" }
];

// Generate a 20x20 honeycomb grid (400 hexes) - only some have mods
const generateHexGrid = () => {
    const grid = [];
    const modIndices = [25, 67, 88, 123, 156, 189, 234, 267]; // Scattered positions
    
    for (let i = 0; i < 400; i++) {
        const modIdx = modIndices.indexOf(i);
        if (modIdx !== -1) {
            grid.push({
                ...mockMods[modIdx],
                gridId: i
            });
        } else {
            grid.push({
                gridId: i,
                name: null,
                status: null,
                type: null
            });
        }
    }
    return grid;
};

export default function App() {
    const [selectedMod, setSelectedMod] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isScanning, setIsScanning] = useState(false);
    const [hexGrid, setHexGrid] = useState(generateHexGrid());
    const sidePanelRef = useRef(null);

    const handleHarmonyCheck = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            // Simulate harmony check - update grid
            setHexGrid(hexGrid.map(cell => 
                cell.status === 'warning' ? { ...cell, status: 'stable' } : cell
            ));
        }, 3000);
    };

    const openPanel = (mod) => {
        setSelectedMod(mod);
        setActiveTab('details');
        if (sidePanelRef.current) {
            sidePanelRef.current.classList.add('open');
        }
    };

    const closePanel = () => {
        setSelectedMod(null);
        if (sidePanelRef.current) {
            sidePanelRef.current.classList.remove('open');
        }
    };

    // Close panel when clicking outside
    const handleMainClick = (e) => {
        if (sidePanelRef.current && sidePanelRef.current.classList.contains('open')) {
            if (!sidePanelRef.current.contains(e.target) && !e.target.closest('.hex-cell')) {
                closePanel();
            }
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <div className="logo">THE HIVE</div>
            </header>

            {/* Main Container */}
            <main className="main-container" onClick={handleMainClick}>
                {/* Central Hive Grid - Fills entire space */}
                <div className="hive-container">
                    <div className="hive-grid" id="hiveGrid">
                        {hexGrid.map((cell) => (
                            <div
                                key={cell.gridId}
                                className={`hex-cell ${cell.status ? cell.status : ''}`}
                                data-grid-id={cell.gridId}
                                title={cell.name ? `${cell.name} - ${cell.status}` : ''}
                                onClick={() => cell.name && openPanel(cell)}
                                style={{ cursor: cell.name ? 'pointer' : 'default' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side Panel - Hidden by default */}
                <aside className="side-panel" id="sidePanel" ref={sidePanelRef}>
                    <button className="close-btn" onClick={closePanel}>×</button>
                    
                    <div className="panel-tabs">
                        <button 
                            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                            data-tab="details"
                            onClick={() => setActiveTab('details')}
                        >
                            Mod Details
                        </button>
                        <button 
                            className={`tab ${activeTab === 'scout' ? 'active' : ''}`}
                            data-tab="scout"
                            onClick={() => setActiveTab('scout')}
                        >
                            Scout Feed
                        </button>
                        <button 
                            className={`tab ${activeTab === 'backup' ? 'active' : ''}`}
                            data-tab="backup"
                            onClick={() => setActiveTab('backup')}
                        >
                            Backups
                        </button>
                    </div>
                    
                    <div className="panel-content">
                        {activeTab === 'details' && (
                            <div className="tab-content active" id="details">
                                {selectedMod ? (
                                    <div>
                                        <h3>{selectedMod.name}</h3>
                                        <p><strong>Type:</strong> {selectedMod.type}</p>
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span className={`status-${selectedMod.status}`}>
                                                {selectedMod.status.toUpperCase()}
                                            </span>
                                        </p>
                                        <p><strong>Version:</strong> Latest</p>
                                        <div style={{ marginTop: '20px' }}>
                                            <button className="action-btn">Update</button>
                                            <button className="action-btn">Remove</button>
                                            <button className="action-btn">Lock Version</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>Select a mod to view details</div>
                                )}
                            </div>
                        )}
                        {activeTab === 'scout' && (
                            <div className="tab-content active" id="scout">
                                Recommended mods will appear here
                            </div>
                        )}
                        {activeTab === 'backup' && (
                            <div className="tab-content active" id="backup">
                                Backup options will appear here
                            </div>
                        )}
                    </div>
                </aside>
            </main>

            {/* Bottom Status Bar */}
            <footer className="status-bar">
                <div className="bee-activity">
                    <span className="bee-icon">🔶</span>{' '}
                    {isScanning ? 'Bees analyzing harmony...' : 'Worker bees scanning...'}
                </div>
                <button 
                    className="harmony-check-btn"
                    onClick={handleHarmonyCheck}
                    disabled={isScanning}
                >
                    {isScanning ? 'SCANNING...' : 'HARMONY CHECK'}
                </button>
            </footer>
        </div>
    );
}