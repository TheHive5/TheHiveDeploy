import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import HexGrid from './components/HexGrid';
import './styles/honeycomb.css';

// Worker bee agents - positioned in perfectly symmetric ring around queen
// Flat-top hexagon neighbors of (0,0): right, down-right, down-left, left, up-left, up-right
// Palette: Honey #D4A82A, Copper #D97C3E, Chestnut #A84D2C, Cocoa #663333, Dark Brown #3D2B2B
const WORKER_AGENTS = [
  { 
    id: 1, 
    name: 'Planner', 
    description: 'Strategic Planning',
    color: '#D97C3E',  // Copper
    hex: { row: 0, col: 1 },
    symbol: '□'
  },
  { 
    id: 2, 
    name: 'Writer', 
    description: 'Content Creation',
    color: '#A84D2C',  // Chestnut
    hex: { row: 1, col: 1 },
    symbol: '▸'
  },
  { 
    id: 3, 
    name: 'Researcher', 
    description: 'Data Analysis',
    color: '#D97C3E',  // Copper
    hex: { row: 1, col: 0 },
    symbol: '◆'
  },
  { 
    id: 4, 
    name: 'Analyst', 
    description: 'Performance Metrics',
    color: '#A84D2C',  // Chestnut
    hex: { row: 0, col: -1 },
    symbol: '▲'
  },
  { 
    id: 5, 
    name: 'Designer', 
    description: 'Visual Design',
    color: '#D97C3E',  // Copper
    hex: { row: -1, col: -1 },
    symbol: '◇'
  },
  { 
    id: 6, 
    name: 'Developer', 
    description: 'Implementation',
    color: '#A84D2C',  // Chestnut
    hex: { row: -1, col: 0 },
    symbol: '⬢'
  }
];

export default function App() {
  const [task, setTask] = useState('');
  const [activeAgent, setActiveAgent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const containerRef = useRef(null);

  const submitTask = async () => {
    if (!task.trim() || !activeAgent) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, agentId: activeAgent })
      });
      const data = await response.json();
      setResults(prev => [
        { task, agentId: activeAgent, response: data.result, timestamp: Date.now() },
        ...prev
      ]);
      setCompletedTasks(prev => prev + 1);
      setTask('');
      setActiveAgent(null);
    } catch (err) {
      console.error('Task submission failed:', err);
      setResults(prev => [
        { task, agentId: activeAgent, response: 'Error: Could not connect to backend', timestamp: Date.now() },
        ...prev
      ]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && activeAgent && task.trim()) {
      submitTask();
    }
  };

  const activeAgentData = WORKER_AGENTS.find(a => a.id === activeAgent);
  const honeycombFill = (completedTasks / 10) * 100; // Fill based on 10 tasks

  return (
    <div className="hive-app-geometric" ref={containerRef}>
      {/* Full-screen hexagonal grid - integrated with Queen and Workers */}
      <HexGrid 
        width={typeof window !== 'undefined' ? window.innerWidth : 1400} 
        height={typeof window !== 'undefined' ? window.innerHeight : 900}
        hexSize={50}
        workers={WORKER_AGENTS}
        activeAgent={activeAgent ? `${WORKER_AGENTS.find(a => a.id === activeAgent)?.hex.row}_${WORKER_AGENTS.find(a => a.id === activeAgent)?.hex.col}` : null}
        onSelectAgent={(hexId) => {
          const [row, col] = hexId.split('_').map(Number);
          const agent = WORKER_AGENTS.find(a => a.hex.row === row && a.hex.col === col);
          if (agent) setActiveAgent(agent.id);
        }}
      />

      {/* Overlay UI: Title at top, Input at bottom */}
      <div className="hive-content">
        
        {/* Top: Title */}
        <motion.h1 
          className="hive-title-top"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          THE HIVE
        </motion.h1>

        {/* Bottom: Results (if any) */}
        {results.length > 0 && (
          <motion.div
            className="hex-results-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="results-title">Task History</h2>
            <div className="results-hex-grid">
              {results.slice(0, 4).map((result, idx) => (
                <motion.div
                  key={idx}
                  className="result-hex-cell"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="result-hex-inner">
                    <div className="result-agent-name">
                      {WORKER_AGENTS.find(a => a.id === result.agentId)?.name}
                    </div>
                    <div className="result-text">
                      {result.response.substring(0, 50)}...
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom: Input Panel */}
        <motion.div
          className="hex-input-panel-bottom"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="input-content">
            <div className="hex-input-container">
              <div className="hex-input-field">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter task..."
                  className="geometric-input"
                  disabled={loading}
                />
              </div>

              <button
                onClick={submitTask}
                disabled={!activeAgent || !task.trim() || loading}
                className="hex-submit-btn"
                style={{
                  opacity: activeAgent ? 1 : 0.5,
                  cursor: activeAgent ? 'pointer' : 'not-allowed'
                }}
              >
                <span className="submit-symbol">⬆</span>
              </button>
            </div>

            {activeAgentData && (
              <motion.div
                className="active-agent-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="agent-badge" style={{ borderColor: activeAgentData.color }}>
                  {activeAgentData.name} — {activeAgentData.description}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}