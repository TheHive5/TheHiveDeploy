import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './styles/honeycomb.css';

const WORKER_BEES = [
  { id: 1, name: 'Planner', icon: '📋', color: '#f59e0b' },
  { id: 2, name: 'Writer', icon: '✍️', color: '#ec4899' },
  { id: 3, name: 'Researcher', icon: '🔍', color: '#8b5cf6' },
  { id: 4, name: 'Analyst', icon: '📊', color: '#06b6d4' },
  { id: 5, name: 'Designer', icon: '🎨', color: '#10b981' },
  { id: 6, name: 'Developer', icon: '💻', color: '#3b82f6' }
];

export default function App() {
  const [task, setTask] = useState('');
  const [activeAgent, setActiveAgent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeWorker, setActiveWorker] = useState(null);

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
      setResults(prev => [{ task, agentId: activeAgent, response: data.result }, ...prev]);
      setTask('');
      setActiveAgent(null);
    } catch (err) {
      console.error('Task submission failed:', err);
      setResults(prev => [{ task, agentId: activeAgent, response: 'Error: Could not connect to backend' }, ...prev]);
    }
    setLoading(false);
  };

  const workerBee = WORKER_BEES.find(b => b.id === activeWorker);

  return (
    <div className="hive-app">
      <div className="hive-container">
        {/* Task Input Panel - Top */}
        <motion.div 
          className="task-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="title">THE HIVE</h1>
          <div className="input-group">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitTask()}
              placeholder="Describe your task..."
              className="task-input"
              disabled={loading}
            />
            <button
              onClick={submitTask}
              disabled={!activeAgent || !task.trim() || loading}
              className="submit-btn"
              style={{ background: activeAgent ? '#f59e0b' : '#ccc', cursor: activeAgent ? 'pointer' : 'not-allowed' }}
            >
              {loading ? '⏳' : '🚀'}
            </button>
          </div>
        </motion.div>

        {/* Honeycomb Grid */}
        <div className="honeycomb-container">
          <motion.div 
            className="honeycomb"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {/* Queen Bee - Center */}
            <motion.div 
              className="hex-cell queen-bee"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(245, 158, 11, 0.3)',
                  '0 0 40px rgba(245, 158, 11, 0.6)',
                  '0 0 20px rgba(245, 158, 11, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="hex-content">
                <div className="hex-icon">👑</div>
                <div className="hex-label">Queen</div>
                <div className="hex-status">Ready</div>
              </div>
            </motion.div>

            {/* Worker Bees - Surrounding */}
            {WORKER_BEES.map((bee, index) => (
              <motion.div
                key={bee.id}
                className={`hex-cell worker-bee ${activeAgent === bee.id ? 'active' : ''}`}
                style={{ 
                  '--bee-color': bee.color,
                  '--hex-position': index
                }}
                onClick={() => setActiveAgent(bee.id)}
                onMouseEnter={() => setActiveWorker(bee.id)}
                onMouseLeave={() => setActiveWorker(null)}
                whileHover={{ scale: 1.15 }}
                animate={{
                  boxShadow: activeAgent === bee.id 
                    ? `0 0 30px ${bee.color}, inset 0 0 20px ${bee.color}40`
                    : `0 0 15px ${bee.color}40`
                }}
              >
                <div className="hex-content">
                  <div className="hex-icon">{bee.icon}</div>
                  <div className="hex-label">{bee.name}</div>
                  {activeAgent === bee.id && (
                    <motion.div 
                      className="hex-selected"
                      layoutId="selected-indicator"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Worker Details Tooltip */}
        {workerBee && (
          <motion.div 
            className="worker-tooltip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="tooltip-content">
              <span className="tooltip-name">{workerBee.name}</span>
              <span className="tooltip-dot" style={{ background: workerBee.color }}></span>
            </div>
          </motion.div>
        )}

        {/* Task History - Bottom */}
        {results.length > 0 && (
          <motion.div 
            className="results-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Task History</h2>
            <div className="results-list">
              {results.slice(0, 3).map((result, idx) => (
                <motion.div
                  key={idx}
                  className="result-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="result-agent">{WORKER_BEES.find(b => b.id === result.agentId)?.name}</div>
                  <div className="result-text">{result.response.substring(0, 60)}...</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}