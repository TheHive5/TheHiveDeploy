#!/usr/bin/env node
/**
 * Bootstrap script - this is run by npm before electron to set up the environment
 */

const path = require('path');
const fs = require('fs');

// Get the electron module path
const electronPath = require.resolve('electron');
console.log('[BOOTSTRAP] Electron resolved to:', electronPath);

// Try alternative require patterns
const electronDir = path.dirname(electronPath);
const distPath = path.join(path.dirname(electronDir), 'dist');
const mainJsPath = path.join(distPath, 'main.js');

console.log('[BOOTSTRAP] Electron dir:', electronDir);
console.log('[BOOTSTRAP] Dist path:', distPath);
console.log('[BOOTSTRAP] Main JS path:', mainJsPath);

// Check if native module can be loaded
try {
  // This is hacky but might work - try to load electron-prebuilt if it exists
  const nativeBinding = require.resolve('electron/dist/node.lib');
  console.log('[BOOTSTRAP] Found native binding at:', nativeBinding);
} catch (e) {
  console.log('[BOOTSTRAP] No native binding found');
}

// Try finding the actual Electron binary and running it properly
const electronBinary = path.join(distPath, 'electron.exe');
if (fs.existsSync(electronBinary)) {
  console.log('[BOOTSTRAP] Found Electron binary at:', electronBinary);
  console.log('[BOOTSTRAP] Would run:', electronBinary, 'with args:', process.argv.slice(2));
  
  // Instead of trying to require it, we should spawn it
  const { spawn } = require('child_process');
  const mainFile = path.join(process.cwd(), 'dist/main/main.js');
  
  console.log('[BOOTSTRAP] Spawning Electron with main file:', mainFile);
  const child = spawn(electronBinary, [mainFile], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
  });
  
  child.on('exit', (code) => {
    console.log('[BOOTSTRAP] Electron exited with code:', code);
    process.exit(code);
  });
} else {
  console.error('[BOOTSTRAP] Electron binary not found!');
  process.exit(1);
}