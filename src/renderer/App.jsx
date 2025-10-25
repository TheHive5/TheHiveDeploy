import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import HexGrid from './components/HexGrid';
import GeometricBee from './components/GeometricBee';
import './styles/honeycomb.css';

// Worker bee agents with specific hex positions
const WORKER_AGENTS = [
  { 
    id: 1, 
    name: 'Planner', 
    description: 'Strategic Planning',
    color: '#FFD700',
    hex: { row: -3, col: 0 },
    symbol: '□'
  },
  { 
    id: 2, 
    name: 'Writer', 
    description: 'Content Creation',
    color: '#FFC300',
    hex: { row: -2, col: 2 },
    symbol: '▸'
  },
  { 
    id: 3, 
    name: 'Researcher', 
    description: 'Data Analysis',
    color: '#FFB700',
    hex: { row: 0, col: 3 },
    symbol: '◆'
  },
  { 
    id: 4, 
    name: 'Analyst', 
    description: 'Performance Metrics',
    color: '#FFCB36',
    hex: { row: 3, col: 2 },
    symbol: '▲'
  },
  { 
    id: 5, 
    name: 'Designer', 
    description: 'Visual Design',
    color: '#FFDA00',
    hex: { row: 3, col: -2 },
    symbol: '◇'
  },
  { 
    id: 6, 
    name: 'Developer', 
    description: 'Implementation',
    color: '#FFEF00',
    hex: { row: 0, col: -3 },
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
      {/* Full-screen hexagonal grid background */}
      <div className="hex-grid-background">
        <HexGrid width={typeof window !== 'undefined' ? window.innerWidth : 1400} 
                 height={typeof window !== 'undefined' ? window.innerHeight : 900}
                 hexSize={50} />
      </div>

      {/* Main content overlay */}
      <div className="hive-content">
        
        {/* Top: Hexagonal Input Panel */}
        <motion.div
          className="hex-input-panel"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="hive-title">THE HIVE</h1>
          
          <div className="hex-input-container">
            <div className="hex-input-field">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your task..."
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
        </motion.div>

        {/* Center: Queen Bee and Worker Hexagons */}
        <motion.div
          className="central-honeycomb"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {/* Queen Bee - Central Hex */}
          <motion.div
            className="queen-hex-cell"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.3)',
                '0 0 40px rgba(255, 195, 0, 0.6)',
                '0 0 20px rgba(255, 215, 0, 0.3)'
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="hex-inner">
              <GeometricBee size={60} type="queen" color="#FFD700" />
              <div className="queen-label">QUEEN</div>
              <div className="queen-status">Command Center</div>
              <div className="honeycomb-meter">
                <div className="meter-fill" style={{ width: `${honeycombFill}%` }}></div>
              </div>
            </div>
          </motion.div>

          {/* Worker Bees - Surrounding Hexagons */}
          {WORKER_AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              className={`worker-hex-cell ${activeAgent === agent.id ? 'active' : ''}`}
              style={{
                '--agent-color': agent.color,
                '--hex-row': agent.hex.row,
                '--hex-col': agent.hex.col
              }}
              onClick={() => setActiveAgent(agent.id)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: activeAgent === agent.id
                  ? `0 0 25px ${agent.color}, inset 0 0 15px ${agent.color}60`
                  : `0 0 10px ${agent.color}40`
              }}
            >
              <div className="hex-inner">
                <GeometricBee
                  size={45}
                  type="worker"
                  color={agent.color}
                  isActive={activeAgent === agent.id}
                />
                <div className="agent-symbol">{agent.symbol}</div>
                <div className="worker-label">{agent.name}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom: Task History Hexagonal Panel */}
        {results.length > 0 && (
          <motion.div
            className="hex-results-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
      </div>
    </div>
  );
}