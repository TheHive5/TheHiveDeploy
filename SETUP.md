# Hive Desktop Widget - Setup Guide

## Quick Start

### 1. Prerequisites

- Node.js v16+ (recommended v18 or v20)
- npm or yarn
- Windows 10+, macOS 10.13+, or Linux

### 2. Installation

```bash
# Clone or navigate to the project
cd TheHive

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=sk-your_actual_key_here
```

### 4. Development

```bash
# Start the development server with hot reload
npm run dev

# This will:
# - Start Vite dev server on http://localhost:5173
# - Launch Electron app with dev tools
# - Auto-reload on file changes
```

### 5. Build for Production

```bash
# Build React and main process
npm run build

# Package as installer (Windows)
npm run dist

# Output will be in dist/ directory
```

## Project Structure Explained

### `/src/main`
- **main.ts**: Electron main process
  - Window creation & management
  - System tray integration
  - IPC handlers
  - Background process lifecycle

- **preload.ts**: Security bridge
  - Exposes safe APIs to React
  - IPC wrapper functions
  - Type definitions

### `/src/backend`
- **agents.ts**: LangChain orchestration
  - Manages 6 worker agents
  - Executes AI tasks
  - Tracks status & queue

### `/src/renderer`
- **App.tsx**: Root React component
  - Initializes agent status
  - Manages lifecycle
  
- **HoneycombGrid.tsx**: 7-hex layout
  - Grid positioning
  - Animation orchestration
  
- **HexCell.tsx**: Worker bee cells
  - Status visualization
  - Icons & animations
  
- **QueenBeeCell.tsx**: Center Queen
  - System status display
  - Visual indicator

- **stores/agentStore.ts**: Global state
  - Zustand store
  - Status management

## Configuration

### Hexagon Grid Layout

Edit `HoneycombGrid.tsx` to customize:

```typescript
const hexPositions = [
  { id: 'queen', x: 0, y: 0, size: 'large' },     // Center
  { id: 'w1', x: 1, y: 0, size: 'small' },        // Right
  { id: 'w2', x: 0.5, y: 0.87, size: 'small' },   // Bottom-right
  // ... etc
];
```

### Colors & Styling

Edit `tailwind.config.js`:

```javascript
colors: {
  honey: {
    50: '#FFFBF0',   // Lightest
    100: '#FFF8E1',
    // ... 900 is darkest
  },
}
```

### Window Dimensions

Edit `main.ts`:

```typescript
mainWindow = new BrowserWindow({
  width: 400,   // Change here
  height: 450,  // And here
  // ... other options
});
```

### Animation Speed

Edit `tailwind.config.js` keyframes:

```javascript
beePulse: {
  '0%, 100%': { opacity: '1', transform: 'scale(1)' },
  '50%': { opacity: '0.7', transform: 'scale(1.05)' },
},
```

## Adding New Workers

### 1. Add to agent.ts

```typescript
workers: [
  { id: 'w1', name: 'Planner', status: 'idle' },
  // Add here:
  { id: 'w7', name: 'NewWorker', status: 'idle' },
]
```

### 2. Add position to HoneycombGrid.tsx

```typescript
const hexPositions = [
  // ... existing
  { id: 'w7', x: 0.87, y: 0.5, size: 'small' },
];
```

### 3. Add icon to HexCell.tsx

```typescript
const workerIcons: Record<string, React.ReactNode> = {
  // ... existing
  NewWorker: <YourIcon size={20} />,
};
```

## Troubleshooting

### "Module not found" errors

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Electron won't start

```bash
# Make sure dev server is running
npm run dev:react  # In another terminal

# Then in main terminal
npm run dev:main
```

### Blank white window

1. Check Vite server is running (http://localhost:5173 should load React app)
2. Open DevTools in Electron (F12)
3. Check console for errors
4. Try hard refresh (Ctrl+Shift+R)

### IPC communication fails

1. Check main.ts has correct event names
2. Verify preload.ts exports window.electronAPI
3. Check contextIsolation: true in webPreferences
4. Ensure nodeIntegration: false

### Build fails

```bash
# Rebuild native modules
npm rebuild

# Clear build cache
rm -rf dist/
npm run build
```

## Performance Tips

- Minimize re-renders with React.memo
- Use Zustand for efficient state
- Limit animation complexity
- Profile with DevTools
- Use production build for testing

## IPC Communication Reference

### From React to Main Process

```typescript
// Execute a task
const result = await window.electronAPI.executeTask('task-name');

// Get current status
const status = await window.electronAPI.getAgentStatus();

// Listen for updates
window.electronAPI.onAgentUpdate((status) => {
  console.log('Status updated:', status);
});

// Control window
window.electronAPI.minimizeWindow();
window.electronAPI.closeWindow();
```

### From Main Process to React

In `main.ts`:

```typescript
mainWindow?.webContents.send('agent-update', statusData);
```

## Testing Agents Locally

You can test the agent orchestration without OpenAI:

```typescript
// In agents.ts, modify executeTask:
async executeTask(taskName: string): Promise<string> {
  // Simulate work without calling LLM
  const worker = this.status.workers.find(w => w.status === 'idle');
  if (worker) {
    worker.status = 'working';
    await new Promise(resolve => setTimeout(resolve, 2000));
    worker.status = 'completed';
  }
  return 'Task completed';
}
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure .env file with API key
3. ✅ Run dev server: `npm run dev`
4. ✅ Test the UI
5. ✅ Connect backend agents
6. ✅ Deploy: `npm run dist`

## Support

For detailed information, see README.md

Happy hive building! 🐝