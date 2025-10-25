// Minimal Electron app - test if 'require' works at all
console.log('=== MINIMAL TEST ===');

// First, try to get electron from Node's modules
let electron;
try {
  // This might work if we're ACTUALLY in Electron's main process
  electron = require('electron');
  console.log('Direct require worked');
} catch (e) {
  console.log('Direct require failed:', e.message);
  process.exit(1);
}

if (typeof electron === 'string') {
  console.error('FATAL: require(\"electron\") returned a string!');
  console.error('Got:', electron);
  process.exit(1);
}

console.log('Has app:', !!electron.app);
console.log('App type:', typeof electron.app);

if (!electron.app) {
  console.error('FATAL: No app property on electron module!');
  process.exit(1);
}

console.log('Creating simple window...');
const { app, BrowserWindow } = electron;

app.on('ready', () => {
  console.log('[APP] Ready event fired');
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
});

console.log('Setup complete, waiting for ready...');
