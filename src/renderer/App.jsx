import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AGENTS = [
  { id: 1, name: 'Planner', role: 'Strategic Planning', color: '#f59e0b' },
  { id: 2, name: 'Writer', role: 'Content Creation', color: '#ec4899' },
  { id: 3, name: 'Researcher', role: 'Information Gathering', color: '#8b5cf6' },
  { id: 4, name: 'Analyst', role: 'Data Analysis', color: '#06b6d4' },
  { id: 5, name: 'Designer', role: 'Visual Design', color: '#10b981' },
  { id: 6, name: 'Developer', role: 'Code Implementation', color: '#3b82f6' }
];

export default function App() {
  const [task, setTask] = useState('');
  const [activeAgent, setActiveAgent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitTask = async () => {
    if (!task.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, agentId: activeAgent })
      });
      const data = await response.json();
      setResults(prev => [{ task, response: data.result }, ...prev]);
      setTask('');
    } catch (err) {
      console.error('Task submission failed:', err);
      setResults(prev => [{ task, response: 'Error: Could not connect to backend' }, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
            THE HIVE
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Collaborative AI Agent Network for Creative Workflows
          </p>
        </motion.div>

        {/* Agent Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '40px'
        }}>
          {AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveAgent(agent.id)}
              style={{
                padding: '20px',
                background: agent.id === activeAgent 
                  ? agent.color 
                  : 'rgba(15, 23, 42, 0.8)',
                border: `2px solid ${agent.color}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {agent.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: agent.id === activeAgent ? '#fff' : '#cbd5e1',
                marginTop: '5px'
              }}>
                {agent.role}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Task Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '40px'
          }}
        >
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
            Assign Task to Selected Agent
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitTask()}
              placeholder="Enter task description..."
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
              disabled={!activeAgent || loading}
            />
            <button
              onClick={submitTask}
              disabled={!activeAgent || !task.trim() || loading}
              style={{
                padding: '12px 24px',
                background: activeAgent ? '#f59e0b' : 'rgba(148, 163, 184, 0.3)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: activeAgent ? 'pointer' : 'not-allowed',
                opacity: activeAgent ? 1 : 0.5
              }}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Task History
            </h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    fontSize: '13px',
                    borderLeft: '3px solid #f59e0b'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Task: {result.task}
                  </div>
                  <div style={{ color: '#cbd5e1' }}>
                    {result.response}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}