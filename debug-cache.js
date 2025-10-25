console.log('Direct access to module cache...');
const electronPath = Object.keys(require.cache).find(k => k.includes('electron/index.js'));
if (electronPath && require.cache[electronPath]) {
  console.log('Found electron module in cache at:', electronPath);
  const module = require.cache[electronPath];
  console.log('Module exports:', typeof module.exports);
  console.log('Has app?', !!module.exports.app);
  if (module.exports.app) {
    console.log('SUCCESS! Got electron.app via cache');
    const { app, BrowserWindow } = module.exports;
    console.log('app.getVersion():', app.getVersion());
  }
} else {
  console.log('Cannot find electron in cache');
}
