import React, { useEffect, useState } from 'react';

const StatusBar = ({ workerStatus }) => {
  const getStatusMessage = (status) => {
    switch (status) {
      case 'scanning': return '🔍 Scanning mods...';
      case 'verifying': return '✓ Verifying dependencies...';
      case 'updating': return '⚡ Updating mods...';
      default: return '◇ Ready';
    }
  };

  const beeAnimations = ['◇', '◈', '◇'];
  const [beeIndex, setBeeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeeIndex(prev => (prev + 1) % beeAnimations.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="status-bar">
      <div className="status-content">
        <div className="worker-bees">
          <span className="bee">◇</span>
          <span className="bee">◈</span>
          <span className="bee animated">{beeAnimations[beeIndex]}</span>
          <span className="bee">◆</span>
          <span className="bee">◇</span>
        </div>
        <div className="status-message">
          {getStatusMessage(workerStatus)}
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;