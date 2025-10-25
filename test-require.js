const electronModule = require('electron');
console.log('Electron module type:', typeof electronModule);
console.log('Electron module keys:', Object.keys(electronModule));
console.log('Has app?:', 'app' in electronModule);
console.log('process.type:', process.type);
