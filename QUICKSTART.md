# Hive Desktop Widget v1.5 - Quick Start Checklist

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Configure Environment (1 min)
```bash
# Copy example
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your_actual_key_here
```

### Step 3: Start Development (immediate)
```bash
npm run dev
```

✅ You should see:
- Vite dev server: http://localhost:5173
- Electron window with hexagonal grid
- 6 worker bees + 1 queen bee

---

## 📋 Pre-Launch Checklist

- [ ] **Node.js v16+** installed (`node --version`)
- [ ] **npm** available (`npm --version`)
- [ ] **.env file** created with `OPENAI_API_KEY`
- [ ] **Internet connection** (for OpenAI API)
- [ ] **Port 5173** available (Vite dev server)
- [ ] No errors in terminal

---

## 🐝 What You Get

### UI Features
- ✅ Hexagonal honeycomb grid (7 cells)
- ✅ Center Queen bee (system status)
- ✅ 6 Worker bees (AI agents)
- ✅ Smooth animations & glow effects
- ✅ Floating always-on-top window
- ✅ System tray integration
- ✅ Beautiful honey/amber color scheme

### Backend Features
- ✅ LangChain agent orchestration
- ✅ Task execution system
- ✅ Agent status tracking
- ✅ Real-time updates
- ✅ Error handling

### Developer Experience
- ✅ Hot module reloading (React)
- ✅ TypeScript support
- ✅ Electron DevTools
- ✅ IPC communication
- ✅ Zustand state management

---

## 🚀 First Steps After Setup

### 1. Explore the UI
```bash
npm run dev
```
- Click on worker hexagons
- Watch animations
- Minimize to system tray (close button)
- Right-click tray icon to show/hide

### 2. Test a Task
```typescript
// In Electron DevTools (F12)
window.electronAPI.executeTask('research')
  .then(r => console.log(r))
```

### 3. Monitor Status
```typescript
// Check current status
window.electronAPI.getAgentStatus()
  .then(s => console.table(s.workers))

// Listen for updates
window.electronAPI.onAgentUpdate(s => console.log(s))
```

### 4. Modify Colors
Edit `tailwind.config.js` colors and watch changes auto-reload

### 5. Build for Production
```bash
npm run build
npm run dist  # Creates installer
```

---

## 📁 Project Structure Quick Reference

```
TheHive/
├── src/
│   ├── main/
│   │   ├── main.ts         ← Electron window & IPC
│   │   └── preload.ts      ← Security bridge
│   ├── backend/
│   │   └── agents.ts       ← LangChain agents
│   └── renderer/
│       ├── components/
│       │   ├── App.tsx         ← Root component
│       │   ├── HoneycombGrid.tsx ← 7-hex layout
│       │   ├── HexCell.tsx      ← Worker bee cell
│       │   ├── QueenBeeCell.tsx ← Queen bee
│       │   └── Header.tsx       ← Window header
│       ├── stores/
│       │   └── agentStore.ts ← Zustand store
│       └── styles/
│           └── globals.css  ← Tailwind styles
├── .env.example        ← Template for env vars
├── tailwind.config.js  ← Color & animation config
├── vite.config.ts      ← Build config
├── tsconfig.json       ← TypeScript config
├── package.json        ← Dependencies
└── README.md           ← Full documentation
```

---

## 🎯 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server + Electron |
| `npm run dev:react` | Start only React dev server |
| `npm run dev:main` | Start only Electron |
| `npm run build` | Build for production |
| `npm run build:react` | Build React app |
| `npm run build:main` | Build Electron main process |
| `npm run dist` | Create Windows installer |
| `npm start` | Run built app |

---

## 🔧 Troubleshooting Quick Fixes

### ❌ "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Blank white window"
- Check Vite is running: http://localhost:5173
- Press F12 to open DevTools
- Check console for errors
- Try Ctrl+Shift+R (hard refresh)

### ❌ "IPC not working"
- Verify main.ts has event handlers
- Check preload.ts exposes electronAPI
- Ensure contextIsolation: true

### ❌ "API key error"
- Create .env file (copy from .env.example)
- Add valid OPENAI_API_KEY
- Restart dev server

---

## 💡 Common Customizations

### Change Window Size
```typescript
// main.ts line 15
width: 500,   // Change from 400
height: 500,  // Change from 450
```

### Change Colors
```javascript
// tailwind.config.js
honey: {
  500: '#FF6B00',  // Change hex to your color
}
```

### Speed Up Animations
```javascript
// tailwind.config.js
'bee-pulse': 'beePulse 0.8s ...'  // from 1.5s
```

### Add More Workers
```typescript
// src/backend/agents.ts
workers: [
  // Add more here
  { id: 'w7', name: 'NewWorker', status: 'idle' },
]

// HoneycombGrid.tsx
hexPositions.push(
  { id: 'w7', x: 1.5, y: 0.87, size: 'small' }
)
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Full feature list & architecture |
| **SETUP.md** | Detailed setup & configuration |
| **DESIGN.md** | Visual design system & colors |
| **API_REFERENCE.md** | Complete API documentation |
| **ASSETS.md** | Icon & asset management |
| **.env.example** | Environment variable template |

---

## 🎓 Learning Path

### Beginner
1. ✅ Get it running: `npm run dev`
2. ✅ Explore UI: click hexagons, watch animations
3. ✅ Read DESIGN.md: understand colors & layout
4. ✅ Check README.md: overview of features

### Intermediate
1. ✅ Read SETUP.md: deep dive into configuration
2. ✅ Modify colors in tailwind.config.js
3. ✅ Test API in DevTools
4. ✅ Add a new worker bee

### Advanced
1. ✅ Study agents.ts: understand LangChain integration
2. ✅ Create custom LLMChain
3. ✅ Implement real task processing
4. ✅ Deploy & package for distribution

---

## 🚢 Deployment Checklist

- [ ] ✅ Code tested in dev mode
- [ ] ✅ .env has production keys
- [ ] ✅ No console errors
- [ ] ✅ Animations performant (60 FPS)
- [ ] ✅ Icons added to assets/ folder
- [ ] ✅ Run `npm run build`
- [ ] ✅ Run `npm run dist`
- [ ] ✅ Test installer on clean machine

---

## 📞 Need Help?

### Quick Answers
1. Check relevant documentation file (see above)
2. Search in README.md
3. Check API_REFERENCE.md for function docs
4. Look at existing code examples

### Common Issues
- See **SETUP.md** → Troubleshooting section
- Check Electron DevTools (F12)
- Review console for error messages

### Create Issues
Include:
- Node.js version: `node --version`
- npm version: `npm --version`
- Full error message
- Steps to reproduce

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Window appears on screen  
✅ 7 hexagons render (1 queen + 6 workers)  
✅ Hexagons glow on hover  
✅ Animation is smooth (no stuttering)  
✅ Queen bee shows status text  
✅ Close button minimizes to tray  
✅ System tray shows icon  
✅ Tray right-click menu works  
✅ Console has no red errors  
✅ DevTools console shows undefined for electronAPI (normal on page load, defined after Electron ready)

---

## 🐝 Welcome to the Hive!

You're now ready to:
- 🎨 Customize the UI
- 🤖 Connect AI agents
- ⚙️ Configure workflows
- 🚀 Deploy your widget

Happy coding! 🚀

---

**Next:** Read `SETUP.md` for detailed configuration options.