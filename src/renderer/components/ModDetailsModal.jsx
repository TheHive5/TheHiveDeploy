import React, { useEffect } from 'react';

const ModDetailsModal = ({ mod, onClose, linkedMods }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!mod) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mod-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{mod.name}</h1>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="mod-header-info">
            <div className="mod-version">v{mod.version}</div>
            <div className={`mod-status status-${mod.status}`}>
              {mod.status.toUpperCase()}
            </div>
          </div>

          <div className="mod-details-grid">
            <div className="detail-section">
              <h3>Overview</h3>
              <p className="mod-type">Type: {mod.type}</p>
              <p className="mod-description">
                A high-quality modification providing enhanced features and improvements to your Minecraft instance.
              </p>
            </div>

            <div className="detail-section">
              <h3>Compatibility Score</h3>
              <div className="large-compatibility">
                <div className="circle-progress" style={{ 
                  background: `conic-gradient(#FFD85C 0deg ${mod.compatibility * 3.6}deg, #C68E17 ${mod.compatibility * 3.6}deg)` 
                }}>
                  <div className="progress-inner">
                    <span>{mod.compatibility}%</span>
                  </div>
                </div>
              </div>
            </div>

            {linkedMods.length > 0 && (
              <div className="detail-section">
                <h3>Dependencies ({linkedMods.length})</h3>
                <div className="dependencies-list">
                  {linkedMods.map(linked => (
                    <div key={linked.id} className="dep-item">
                      <div className="dep-icon">◆</div>
                      <div className="dep-info">
                        <div className="dep-name">{linked.name}</div>
                        <div className={`dep-status status-${linked.status}`}>
                          {linked.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="action-primary">🔧 Repair</button>
          <button className="action-primary">⚡ Update</button>
          <button className="action-primary">🔒 Lock Version</button>
          <button className="action-danger">🗑 Remove</button>
        </div>
      </div>
    </div>
  );
};

export default ModDetailsModal;