#!/usr/bin/env node
process.env.NODE_ENV = 'development';

console.log('[TEST] Starting test...');
console.log('[TEST] Loading electron module...');

try {
  const electron = require('electron');
  console.log('[TEST] Electron loaded successfully');
  console.log('[TEST] Electron.app:', typeof electron.app);
  console.log('[TEST] Electron.BrowserWindow:', typeof electron.BrowserWindow);
} catch (error) {
  console.error('[TEST] Failed to load electron:', error.message);
}

console.log('[TEST] Loading compiled main.js...');
try {
  require('./dist/main/main.js');
  console.log('[TEST] Main process loaded (this means app event listeners are set up)');
} catch (error) {
  console.error('[TEST] Failed to load main.js:', error.message);
  console.error('[TEST] Stack:', error.stack);
}

console.log('[TEST] Test complete - check if app started');
setTimeout(() => {
  console.log('[TEST] Timeout - exiting...');
  process.exit(0);
}, 3000);