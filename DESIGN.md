# Hive Desktop Widget v1.5 - Design Guide

## Visual Design System

### Color Palette

The Hive uses a warm, honeycomb-inspired color scheme:

```
Primary: Honey Gold
├─ Honey-50:   #FFFBF0  (Lightest background)
├─ Honey-100:  #FFF8E1  (Light background)
├─ Honey-200:  #FFE8A8  (UI elements)
├─ Honey-300:  #FFD96F  (Borders)
├─ Honey-400:  #FFCA36  (Accents)
├─ Honey-500:  #FDB913  (Primary)
├─ Honey-600:  #DFA01A  (Dark)
├─ Honey-700:  #B8821F  (Darker)
├─ Honey-800:  #8B6116  (Very dark)
└─ Honey-900:  #5F410D  (Text/Darkest)

Secondary: Amber
├─ Amber-50:   #FFFBEB  (Light)
├─ Amber-100:  #FEF3C7
├─ Amber-200:  #FDE68A
├─ Amber-300:  #FCD34D
├─ Amber-400:  #FBBF24  (Active state)
├─ Amber-500:  #F59E0B
├─ Amber-600:  #D97706
├─ Amber-700:  #B45309  (Hover)
├─ Amber-800:  #92400E
└─ Amber-900:  #78350F  (Text)

Status Colors:
├─ Idle:       Gray-300  (Dim)
├─ Working:    Amber-400 (Bright pulse)
└─ Completed:  Green-400 (Success)
```

### Typography

```
Font Family: 'Inter', system-ui, -apple-system, sans-serif

Sizes:
├─ Queen name:     14px / 16px (font-sm, font-semibold)
├─ Queen status:   12px / 14px (font-xs, font-semibold)
├─ Worker name:    12px / 14px (font-xs, font-semibold)
├─ Worker status:  11px / 13px (font-xs, opacity-70)
├─ Header title:   13px / 15px (font-sm, font-semibold)
└─ Status bar:     12px / 14px (font-xs)

Line Heights: 1.25 - 1.5
Letter Spacing: Normal
```

### Layout Grid

```
Hexagon Grid Layout (7 cells):

       ╱─╲
      │ Q │  (Center - Queen, 128×128px)
      ╲─╱

    ╱─╲   ╱─╲
   │W1│ │W6│  (Top row)
    ╲─╱   ╲─╱

 ╱─╲     ╱─╲
│W2│   │W5│   (Middle row)
╲─╱     ╲─╱

    ╱─╲   ╱─╲
   │W3│ │W4│  (Bottom row)
    ╲─╱   ╚─╝

Worker Position Math:
- Center: (0, 0)
- W1 (Right):         (100px, 0px)
- W2 (Bottom-Right):  (50px, 87px)
- W3 (Bottom-Left):   (-50px, 87px)
- W4 (Left):          (-100px, 0px)
- W5 (Top-Left):      (-50px, -87px)
- W6 (Top-Right):     (50px, -87px)

Window Size: 400×450px
Hexagon Size: 96×96px (workers), 128×128px (queen)
Grid Container: 256×256px centered
```

### Animation Effects

#### 1. Bee Pulse (Active Workers)

```css
@keyframes beePulse {
  0%, 100%:  opacity: 1, scale(1)
  50%:       opacity: 0.7, scale(1.05)
}
Duration: 1.5s
Curve: cubic-bezier(0.4, 0, 0.6, 1)
```

#### 2. Bee Glow (Completion Indicator)

```css
@keyframes beeGlow {
  0%, 100%:  box-shadow: 0 0 5px rgba(253, 185, 19, 0.3)
  50%:       box-shadow: 0 0 20px rgba(253, 185, 19, 0.8)
}
Duration: 2s
```

#### 3. Bee Buzz (Hover Effect)

```css
@keyframes beeBuzz {
  0%, 100%:  translateX(0)
  25%:       translateX(-1px)
  75%:       translateX(1px)
}
Duration: 0.2s
```

#### 4. Queen Rotation (Active)

```css
Rotate 360° over 3 seconds (linear)
Repeats while processing
```

#### 5. Queen Pulse Ring

```css
Scale from 0.95 to 1.1 over 2 seconds
Opacity from 0.3 to 0.1 to 0.3
```

### Component States

#### Hex Cell States

```
IDLE:
├─ Background:  Honey-100 → Honey-200 gradient
├─ Border:      Honey-300
├─ Text:        Honey-700
├─ Shadow:      0 4px 6px rgba(253, 185, 19, 0.1)
└─ Scale:       1.0

WORKING:
├─ Background:  Amber-200 → Amber-300 gradient (animate)
├─ Border:      Amber-400
├─ Text:        Amber-900
├─ Shadow:      0 0 20px rgba(253, 185, 19, 0.8)
├─ Scale:       1.05 (pulsing)
└─ Animation:   bee-pulse

COMPLETED:
├─ Background:  Green-100 → Green-200 gradient
├─ Border:      Green-300
├─ Text:        Green-700
├─ Shadow:      0 4px 12px rgba(34, 197, 94, 0.4)
└─ Scale:       1.0

HOVER:
├─ Scale:       1.15 (on all states)
├─ Shadow:      Enhanced (xl)
└─ Transition:  300ms ease
```

#### Queen Bee States

```
IDLE:
├─ Background:  Honey-300 → Honey-200 → Amber-300 gradient
├─ Border:      Honey-500 (3px)
├─ Shadow:      0 8px 16px rgba(253, 185, 19, 0.2)
├─ Icon (👑):   No rotation
└─ Status text: Static

PROCESSING:
├─ Background:  (same)
├─ Border:      (same)
├─ Shadow:      0 0 30px rgba(253, 185, 19, 0.9) (pulsing)
├─ Scale:       1.08 (pulsing)
├─ Icon (👑):   Rotate 360° continuously
├─ Status text: Fade 0.6 → 1.0 → 0.6
└─ Ring:        Expanding pulse (0.95 → 1.1)
```

### Responsive Behavior

```
Mobile (< 640px):
├─ Window width:   90vw (max 380px)
├─ Hexagons:       Slightly smaller
└─ Animations:     Reduced fps for battery

Tablet (640px - 1024px):
├─ Window width:   400px
└─ Normal layout

Desktop (> 1024px):
├─ Window width:   400px
└─ Normal layout
```

## Icon Set (Using Lucide React)

```typescript
Workers:
├─ Planner:    Zap          ⚡
├─ Researcher: Search       🔍
├─ Writer:     PenTool      ✍️
├─ Analyst:    BookOpen     📖
├─ Debugger:   Bug          🐛
└─ Validator:  CheckCircle  ✓

Header:
├─ Close:      X            ✕
└─ Minimize:   Minus        −

Queen: 👑 (Emoji)
```

## Glassmorphism Effect

```css
background: linear-gradient(135deg, rgba(255, 251, 240, 0.95) 0%, rgba(255, 232, 168, 0.95) 100%)
backdrop-filter: blur(10px)
border: 2px solid rgba(253, 185, 19, 0.2)
box-shadow: 
  0 8px 32px rgba(139, 97, 22, 0.15),
  inset 0 1px 0 rgba(255, 255, 255, 0.6)
```

## Interactive Elements

### Hex Cell Click Behavior

```
Normal → Hover:
├─ Scale:       1.0 → 1.15
├─ Shadow:      6px → xl
└─ Duration:    300ms

Hover → Tap:
├─ Scale:       1.15 → 0.95
└─ Duration:    100ms

Tap → Release:
├─ Scale:       0.95 → 1.15 → 1.0
└─ Duration:    300ms
```

### Status Indicator Dot

```
Position:   -top-2 -right-2 (absolute)
Size:       16×16px
Idle:       Gray-300
Working:    Amber-400 (pulse animation)
Completed:  Green-400
```

## Customization Examples

### Change Accent Color from Honey to Purple

```javascript
// tailwind.config.js
colors: {
  purple: {
    50: '#FAF5FF',
    // ... other shades
    500: '#A855F7',
  }
}
```

### Speed Up Animations

```css
/* Change from 1.5s to 0.8s */
@keyframes beePulse {
  /* ... */
}
animation: bee-pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Increase Window Size

```typescript
mainWindow = new BrowserWindow({
  width: 500,    // from 400
  height: 550,   // from 450
})
```

### Add Drop Shadow to Hex Grid

```typescript
<motion.div
  className="relative w-64 h-64 drop-shadow-2xl"
>
```

## Browser DevTools for Debugging

```javascript
// In Electron DevTools console:

// Check current status
window.electronAPI.getAgentStatus().then(s => console.log(s))

// Execute a task
window.electronAPI.executeTask('plan').then(r => console.log(r))

// Monitor updates
window.electronAPI.onAgentUpdate(s => console.log('Update:', s))
```

## Performance Metrics Target

- Initial load:   < 2 seconds
- Frame rate:     60 FPS stable
- Hover response: < 50ms
- Animation smoothness: 60 FPS
- Memory usage:   < 150MB idle

## Accessibility

- Min contrast ratio: 4.5:1 (WCAG AA)
- Min touch target:   44×44px
- Keyboard navigation: Tab through cells
- Screen reader: Semantic HTML structure
- Focus indicators: Visible ring on cells

---

For implementation details, see SETUP.md and README.md