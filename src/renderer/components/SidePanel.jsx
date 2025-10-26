import React from 'react';

const SidePanel = ({ selectedMod, onCloseMod, activeTab, onTabChange, allMods }) => {
  if (!selectedMod) {
    return (
      <div className="side-panel">
        <div className="panel-empty">
          <p>Select a mod to view details</p>
        </div>
      </div>
    );
  }

  const linkedMods = allMods.filter(m => selectedMod.linkedTo.includes(m.id));

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h2>{selectedMod.name}</h2>
        <button className="close-btn" onClick={onCloseMod}>×</button>
      </div>

      <div className="panel-tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => onTabChange('info')}
        >
          Info
        </button>
        <button 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => onTabChange('logs')}
        >
          Logs
        </button>
        <button 
          className={`tab ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => onTabChange('sync')}
        >
          Sync
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'info' && (
          <div className="tab-content">
            <div className="info-item">
              <label>Version</label>
              <span>{selectedMod.version}</span>
            </div>
            <div className="info-item">
              <label>Type</label>
              <span>{selectedMod.type}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              <span className={`status-badge status-${selectedMod.status}`}>
                {selectedMod.status.toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <label>Compatibility</label>
              <div className="compatibility-bar">
                <div 
                  className="compatibility-fill"
                  style={{ width: `${selectedMod.compatibility}%` }}
                />
              </div>
              <span>{selectedMod.compatibility}%</span>
            </div>

            {linkedMods.length > 0 && (
              <div className="linked-mods">
                <label>Dependencies</label>
                <div className="mods-list">
                  {linkedMods.map(mod => (
                    <div key={mod.id} className="mod-link">
                      <span>{mod.name}</span>
                      <span className={`link-status status-${mod.status}`}>
                        {mod.status.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="tab-content">
            <div className="log-entry">
              <span className="log-time">10:45 AM</span>
              <span>Mod loaded successfully</span>
            </div>
            <div className="log-entry">
              <span className="log-time">10:42 AM</span>
              <span>Dependency check: OK</span>
            </div>
            <div className="log-entry warning">
              <span className="log-time">10:40 AM</span>
              <span>Update available: v1.20.2</span>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="tab-content">
            <div className="sync-options">
              <button className="sync-btn">↑ Upload to Cloud</button>
              <button className="sync-btn">↓ Download Latest</button>
              <button className="sync-btn">⟳ Resync Dependencies</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel-actions">
        <button className="action-btn repair">🔧 Repair</button>
        <button className="action-btn update">⚡ Update</button>
        <button className="action-btn lock">🔒 Lock</button>
        <button className="action-btn remove">🗑 Remove</button>
      </div>
    </div>
  );
};

export default SidePanel;