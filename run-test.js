console.log('[TEST] Script loaded');
console.log('[TEST] process.type:', process.type);
console.log('[TEST] process.version:', process.version);
console.log('[TEST] process.versions:', process.versions);

// Try to load electron
try {
  const electron = require('electron');
  console.log('[TEST] Electron loaded successfully!');
  console.log('[TEST] Electron type:', typeof electron);
  if (typeof electron === 'object' && electron.app) {
    console.log('[TEST] Electron module is valid!');
  }
} catch (e) {
  console.error('[TEST] Failed to load electron:', e.message);
}