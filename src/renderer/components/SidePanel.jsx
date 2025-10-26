import React from 'react';

const SidePanel = ({ selectedMod, onCloseMod, activeTab, onTabChange, allMods }) => {
  if (!selectedMod) {
    return (
      <aside className="side-panel side-panel-empty">
        <div className="panel-placeholder">
          <p>Select a mod to view details</p>
        </div>
      </aside>
    );
  }

  const linkedMods = allMods.filter(m => selectedMod.linkedTo?.includes(m.id));

  return (
    <aside className="side-panel">
      <div className="panel-header">
        <h2>{selectedMod.name}</h2>
        <button className="close-btn" onClick={onCloseMod}>✕</button>
      </div>

      <div className="panel-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => onTabChange('info')}
        >
          Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => onTabChange('logs')}
        >
          Logs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => onTabChange('sync')}
        >
          Sync
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'info' && (
          <div className="tab-content">
            <div className="info-row">
              <label>Version</label>
              <span>{selectedMod.version}</span>
            </div>
            <div className="info-row">
              <label>Type</label>
              <span>{selectedMod.type}</span>
            </div>
            <div className="info-row">
              <label>Status</label>
              <span className={`status-badge status-${selectedMod.status}`}>
                {selectedMod.status.toUpperCase()}
              </span>
            </div>
            <div className="info-row">
              <label>Compatibility</label>
              <div className="compatibility-bar">
                <div 
                  className="compatibility-fill" 
                  style={{ width: `${selectedMod.compatibility}%` }}
                ></div>
              </div>
              <span className="compat-text">{selectedMod.compatibility}%</span>
            </div>

            <div className="dependencies-section">
              <h3>Dependencies</h3>
              {linkedMods.length > 0 ? (
                <div className="dependencies-list">
                  {linkedMods.map(mod => (
                    <div key={mod.id} className="dep-item">
                      <span className={`dep-status dep-status-${mod.status}`}>●</span>
                      <span>{mod.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-deps">No dependencies</p>
              )}
            </div>

            <div className="actions">
              <button className="action-btn action-repair">Repair</button>
              <button className="action-btn action-update">Update</button>
              <button className="action-btn action-lock">Lock</button>
              <button className="action-btn action-remove">Remove</button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="tab-content">
            <div className="logs-container">
              <div className="log-entry log-info">
                <span className="log-time">10:23 AM</span>
                <span className="log-msg">Mod loaded successfully</span>
              </div>
              <div className="log-entry log-success">
                <span className="log-time">10:22 AM</span>
                <span className="log-msg">Dependencies verified</span>
              </div>
              <div className="log-entry log-warning">
                <span className="log-time">10:21 AM</span>
                <span className="log-msg">Compatibility warning detected</span>
              </div>
              <div className="log-entry log-info">
                <span className="log-time">10:20 AM</span>
                <span className="log-msg">Checking for updates</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="tab-content">
            <div className="sync-options">
              <label className="sync-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Auto-sync with cloud</span>
              </label>
              <label className="sync-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Backup on update</span>
              </label>
              <label className="sync-checkbox">
                <input type="checkbox" />
                <span>Share with hive</span>
              </label>
            </div>
            <button className="sync-btn">Sync Now</button>
            <button className="sync-btn sync-btn-restore">Restore from Backup</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidePanel;