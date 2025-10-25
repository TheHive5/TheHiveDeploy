import React from 'react';
import { X, Minus } from 'lucide-react';

export function Header() {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="header-bar px-4 py-3 flex items-center justify-between border-b border-honey-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">🐝</span>
        <h1 className="text-sm font-semibold text-honey-900">Hive v1.5</h1>
      </div>

      <div className="window-controls flex items-center gap-2">
        <button
          onClick={handleMinimize}
          className="p-1 hover:bg-honey-200 rounded transition-colors"
          aria-label="Minimize"
        >
          <Minus size={16} className="text-honey-700" />
        </button>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-amber-200 rounded transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-amber-700" />
        </button>
      </div>
    </div>
  );
}