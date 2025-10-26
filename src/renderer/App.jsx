import React, { useState, useEffect } from 'react';
import './styles/hive.css';

// Sample mod data
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

export default function App() {
    const [selectedMod, setSelectedMod] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isScanning, setIsScanning] = useState(false);
    const [mods, setMods] = useState(mockMods);

    const handleHarmonyCheck = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            // Update some mods randomly
            setMods(mods.map((mod, idx) => 
                idx === 2 ? { ...mod, status: 'stable' } : mod
            ));
        }, 3000);
    };

    const showModDetails = (mod) => {
        setSelectedMod(mod);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <div className="logo">THE HIVE</div>
                <div className="subtitle">Minecraft Mod Manager</div>
            </header>

            {/* Main Container */}
            <main className="main-container">
                {/* Central Hive Grid */}
                <div className="hive-container">
                    <div className="hive-grid" id="hiveGrid">
                        {mods.map((mod) => (
                            <div
                                key={mod.id}
                                className={`hex-cell ${mod.status}`}
                                data-mod-id={mod.id}
                                title={`${mod.name} - ${mod.status}`}
                                onClick={() => showModDetails(mod)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side Panel */}
                <aside className="side-panel" id="sidePanel">
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
                                        <h3 style={{ color: '#FFD85C', marginBottom: '15px' }}>
                                            {selectedMod.name}
                                        </h3>
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