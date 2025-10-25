# Hive Desktop Widget v1.5

A beautiful, always-on Electron app with a hexagonal honeycomb grid interface for AI agent orchestration.

## Features

- 🎨 **Hexagonal Honeycomb Grid** - Visual representation of worker bees (AI agents)
- 👑 **Queen Bee Center** - System coordinator showing overall status
- 🐝 **6 Worker Bees** - Planner, Researcher, Writer, Analyst, Debugger, Validator
- ✨ **Smooth Animations** - Bee-buzz effects, pulsing animations, glow effects
- 🎯 **Always-on-Top Floating Window** - Minimize to system tray
- 🌟 **Tailwind CSS** - Beautiful honey/amber color palette
- 🤖 **LangChain Integration** - Full agent orchestration support

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 27
- **UI Library**: react-hexgrid, Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Node.js + LangChain
- **Build**: Vite + TypeScript

## Project Structure

```
TheHive/
├── src/
│   ├── main/
│   │   ├── main.ts           # Electron main process
│   │   └── preload.ts        # Electron preload script
│   ├── backend/
│   │   └── agents.ts         # LangChain agent orchestration
│   └── renderer/
│       ├── components/       # React components
│       ├── stores/          # Zustand stores
│       ├── styles/          # Global styles
│       └── index.tsx        # React entry point
├── assets/                   # Icons & assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── electron-builder.yml
```

## Installation

```bash
# Install dependencies
npm install

# Install lucide-react for icons
npm install lucide-react
```

## Development

```bash
# Start dev server (React + Electron)
npm run dev

# Build for production
npm run build

# Package as installer
npm run dist
```

## Configuration

### Environment Variables

Create `.env` file in root:

```
OPENAI_API_KEY=your_key_here
```

### Customization

- **Colors**: Edit `tailwind.config.js` honey/amber colors
- **Animations**: Modify keyframes in `tailwind.config.js`
- **Workers**: Add/remove in `src/renderer/components/HoneycombGrid.tsx`

## Architecture

### Frontend (React)
- **App.tsx**: Main container, loads agent status
- **HoneycombGrid.tsx**: 7-hex layout (1 Queen + 6 Workers)
- **HexCell.tsx**: Individual worker bee cells
- **QueenBeeCell.tsx**: Central coordinator display

### Backend (Node.js + LangChain)
- **agents.ts**: Agent orchestrator
- Worker agents: Planner, Researcher, Writer, Analyst, Debugger, Validator
- Task execution and status management

### IPC Communication
- `execute-task`: Run agent task
- `get-agent-status`: Fetch current status
- `agent-update`: Real-time status updates

## Window Management

- **Main Window**: 400x450px, frameless, always-on-top
- **Transparency**: Full support via `transparent: true`
- **Close Behavior**: Minimize to tray (app continues in background)
- **System Tray**: Right-click menu with Show/Quit options

## Styling Notes

- Custom honeycomb palette with amber/honey colors
- Glassmorphism effect with `backdrop-filter: blur(10px)`
- Hover animations scale hex cells
- Active workers pulse with glow
- Completed tasks show green halo

## Performance

- Lazy loading of agent status
- Memoized components with React.memo
- Zustand for efficient state updates
- Framer Motion GPU-accelerated animations

## Troubleshooting

### Blank window in development
- Ensure Vite dev server is running (`npm run dev:react`)
- Check that port 5173 is available
- Clear browser cache if needed

### IPC errors
- Verify preload script is loaded
- Check contextIsolation enabled
- Ensure handlers registered in main process

### Build errors
- Delete `node_modules` and run `npm install`
- Clear `dist/` directory
- Check Node.js version (v16+)

## Future Enhancements

- [ ] Task history panel
- [ ] Real-time collaboration
- [ ] Custom agent creation
- [ ] Dark mode toggle
- [ ] Voice commands
- [ ] GPU-accelerated hex rendering
- [ ] Multi-window support

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.