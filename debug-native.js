// Test if we can access electron through process global or other means
console.log('process.electronBinding:', typeof process.electronBinding);
console.log('process.__dirname:', process.__dirname);
console.log('process.__filename:', process.__filename);
console.log('electron in global?', 'electron' in global);

// Try native modules
try {
  const nativeModule = process.electronBinding('v8_util');
  console.log('electronBinding works:', !!nativeModule);
} catch(e) {
  console.log('electronBinding error:', e.message);
}

// Check if there's a hidden electron module
try {
  const mod = require.cache[require.resolve('electron')];
  console.log('Direct resolve worked:', !!mod);
} catch(e) {
  console.log('Resolve error:', e.message);
}
