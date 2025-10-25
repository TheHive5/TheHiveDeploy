const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Compile TypeScript
console.log('Building main process...');
// Compile main/backend as CommonJS
const mainOptions = '--outDir dist/main --target ES2020 --module commonjs --skipLibCheck --moduleResolution node --allowSyntheticDefaultImports --esModuleInterop';
const backendOptions = '--outDir dist/backend --target ES2020 --module commonjs --skipLibCheck --moduleResolution node --allowSyntheticDefaultImports --esModuleInterop';

execSync(`npx tsc src/main/main.ts ${mainOptions}`, {
  stdio: 'inherit',
});

execSync(`npx tsc src/main/preload.ts ${mainOptions}`, {
  stdio: 'inherit',
});

execSync(`npx tsc src/backend/agents.ts ${backendOptions}`, {
  stdio: 'inherit',
});

// No need to rename anymore - everything is CommonJS

console.log('Build complete!');