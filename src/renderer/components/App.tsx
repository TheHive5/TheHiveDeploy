import React, { useEffect, useState } from 'react';
import { HoneycombGrid } from './HoneycombGrid';
import { Header } from './Header';
import { useAgentStore } from '../stores/agentStore';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { status, updateStatus } = useAgentStore();

  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const status = await window.electronAPI.getAgentStatus();
        updateStatus(status);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load agent status:', error);
        setIsLoading(false);
      }
    };

    loadInitialStatus();

    // Subscribe to agent updates
    window.electronAPI.onAgentUpdate((status) => {
      updateStatus(status);
    });
  }, [updateStatus]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-honey-50 via-amber-50 to-honey-100">
      {/* Main Hive Window */}
      <div className="hive-window w-96 h-96 relative shadow-2xl">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin">🐝</div>
              <p className="text-honey-600 text-sm mt-2">Initializing Hive...</p>
            </div>
          ) : (
            <HoneycombGrid />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 text-center">
        <p className="text-sm text-honey-700">
          Queen: <span className="font-semibold text-amber-600">{status.queenStatus}</span>
        </p>
        <p className="text-xs text-honey-600">
          Active Workers: <span className="font-semibold">{status.workers.filter(w => w.status === 'working').length}/{status.workers.length}</span>
        </p>
      </div>
    </div>
  );
}