import React, { useEffect } from 'react';

const ModDetailsModal = ({ mod, onClose, linkedMods }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h1>{mod.name}</h1>
          <p className="mod-version">v{mod.version}</p>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h2>Compatibility Score</h2>
            <div className="compatibility-circle">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" className="compat-bg" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  className="compat-fill"
                  style={{
                    strokeDasharray: `${(mod.compatibility / 100) * 565.48} 565.48`
                  }}
                />
              </svg>
              <div className="compat-text-center">
                <span className="compat-number">{mod.compatibility}%</span>
                <span className="compat-label">Compatible</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h2>Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Type</label>
                <span>{mod.type}</span>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-badge status-${mod.status}`}>
                  {mod.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h2>Dependencies</h2>
            {linkedMods && linkedMods.length > 0 ? (
              <div className="dependencies-tree">
                {linkedMods.map(linked => (
                  <div key={linked.id} className="tree-item">
                    <div className={`tree-dot tree-status-${linked.status}`}></div>
                    <span>{linked.name}</span>
                    <span className="tree-version">v{linked.version}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-dependencies">No dependencies</p>
            )}
          </div>

          <div className="modal-actions">
            <button className="action-btn action-repair">Repair</button>
            <button className="action-btn action-update">Update</button>
            <button className="action-btn action-lock">Lock</button>
            <button className="action-btn action-remove">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModDetailsModal;