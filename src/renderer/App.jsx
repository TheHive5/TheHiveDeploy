import React, { useState, useEffect } from 'react';
import HiveGrid from './components/HiveGrid';
import SidePanel from './components/SidePanel';
import StatusBar from './components/StatusBar';
import ModDetailsModal from './components/ModDetailsModal';
import './styles/hive.css';

// Mock mod data for UI testing
const MOCK_MODS = [
  { id: 1, name: 'Biomes O\' Plenty', status: 'stable', version: '1.20.1', linkedTo: [2, 5], type: 'Mod', compatibility: 95 },
  { id: 2, name: 'Optifine', status: 'warning', version: '1.20.1', linkedTo: [1], type: 'Performance', compatibility: 80 },
  { id: 3, name: 'Fabric API', status: 'critical', version: '0.87.2', linkedTo: [6, 7], type: 'Core', compatibility: 100 },
  { id: 4, name: 'Sodium', status: 'stable', version: '0.5.0', linkedTo: [3], type: 'Performance', compatibility: 92 },
  { id: 5, name: 'Lithium', status: 'stable', version: '0.11.2', linkedTo: [1, 3], type: 'Performance', compatibility: 98 },
  { id: 6, name: 'JEI', status: 'stable', version: '14.2.0', linkedTo: [3], type: 'Utility', compatibility: 89 },
  { id: 7, name: 'YUNG\'s Better Caves', status: 'stable', version: '1.0.1', linkedTo: [3], type: 'Mod', compatibility: 94 },
  { id: 8, name: 'Create', status: 'stable', version: '0.5.1', linkedTo: [2, 3], type: 'Mod', compatibility: 88 },
];

export default function App() {
  const [selectedMod, setSelectedMod] = useState(null);
  const [mods, setMods] = useState(MOCK_MODS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // info, logs, sync
  const [workerStatus, setWorkerStatus] = useState('idle'); // idle, scanning, verifying, updating

  // Simulate worker bee activity
  useEffect(() => {
    const statuses = ['idle', 'scanning', 'verifying', 'updating'];
    const interval = setInterval(() => {
      setWorkerStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectMod = (modId) => {
    setSelectedMod(modId);
  };

  const handleCloseMod = () => {
    setSelectedMod(null);
  };

  const getCurrentMod = () => {
    return mods.find(m => m.id === selectedMod);
  };

  return (
    <div className="hive-container">
      {/* Header */}
      <header className="hive-header">
        <div className="hive-brand">
          <h1>The Hive</h1>
          <p className="tagline">Where every mod finds its place</p>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </header>

      {/* Main Content */}
      <main className="hive-main">
        {/* Center Hive Grid */}
        <div className="hive-grid-container">
          <HiveGrid 
            mods={mods} 
            selectedModId={selectedMod}
            onSelectMod={handleSelectMod}
          />
        </div>

        {/* Right Side Panel */}
        {sidebarOpen && (
          <SidePanel 
            selectedMod={getCurrentMod()}
            onCloseMod={handleCloseMod}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            allMods={mods}
          />
        )}

        {/* Mod Details Modal */}
        {selectedMod && (
          <ModDetailsModal 
            mod={getCurrentMod()}
            onClose={handleCloseMod}
            linkedMods={mods.filter(m => 
              getCurrentMod().linkedTo.includes(m.id)
            )}
          />
        )}
      </main>

      {/* Bottom Status Line */}
      <StatusBar workerStatus={workerStatus} />
    </div>
  );
}