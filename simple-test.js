// Dead simple test - try to just get the module
const electron = require('electron');

console.log('=== DEBUG INFO ===');
console.log('process.type:', process.type);
console.log('process.version:', process.version);
console.log('process.versions.electron:', process.versions.electron);
console.log('typeof electron:', typeof electron);
console.log('electron is string?:', typeof electron === 'string');

if (typeof electron === 'string') {
  console.error('FATAL: require("electron") returned a STRING!');
  console.error('This means Electron is not providing the module in this context.');
  console.error('The Electron binary path is:', electron);
  process.exit(1);
}

console.log('\nElectron module contents:');
console.log('- app:', !!electron.app);
console.log('- BrowserWindow:', !!electron.BrowserWindow);
console.log('- ipcMain:', !!electron.ipcMain);

// Try to use it
const { app } = electron;
console.log('\nTrying to call app.whenReady()...');
app.whenReady().then(() => {
  console.log('SUCCESS! app.whenReady() works!');
});