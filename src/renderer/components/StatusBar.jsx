import React, { useState, useEffect } from 'react';

const StatusBar = ({ workerStatus }) => {
  const [beeSymbol, setBeeSymbol] = useState('◇');

  useEffect(() => {
    const symbols = ['◇', '◈', '◆'];
    let index = 0;
    const interval = setInterval(() => {
      setBeeSymbol(symbols[index % symbols.length]);
      index++;
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const statusMessages = {
    idle: 'Ready',
    scanning: 'Scanning mods...',
    verifying: 'Verifying dependencies...',
    updating: 'Updating...'
  };

  return (
    <div className="status-bar">
      <div className="status-bee">
        <span className="bee-symbol">{beeSymbol}</span>
      </div>
      <div className="status-text">
        <span className="status-label">{statusMessages[workerStatus]}</span>
      </div>
    </div>
  );
};

export default StatusBar;