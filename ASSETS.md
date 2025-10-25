# Assets Guide

## Directory Structure

```
assets/
├── icon.png        (512×512px) - macOS/Linux icon
├── icon.ico        (256×256px) - Windows icon
├── icon.icns       (macOS) - macOS app icon
├── tray-icon.png   (256×256px) - System tray icon
└── tray-icon@2x.png (512×512px) - Retina tray icon
```

## Creating Icons

### Option 1: Use an Icon Library

Download from:
- [Iconify](https://iconify.design/) - Search "hive" or "bee"
- [Flaticon](https://www.flaticon.com/) - Bee/hive icons
- [FontAwesome](https://fontawesome.com/) - Professional icons

### Option 2: Create Custom Icons

Use tools like:
- [Figma](https://www.figma.com/) - Design tool
- [Illustrator](https://www.adobe.com/products/illustrator.html) - Professional
- [Sketch](https://www.sketch.com/) - Design focused

### Icon Specifications

```
App Icon:
├─ PNG (macOS/Linux):  512×512 px, RGBA, transparent background
├─ ICO (Windows):      256×256 px (or multiple resolutions)
└─ ICNS (macOS):       Various sizes (16, 32, 64, 128, 256, 512)

Tray Icon:
├─ PNG:                256×256 px, RGBA, transparent background
├─ Retina (@2x):       512×512 px
└─ Note:               Should work on light AND dark backgrounds
```

## Placeholder Icons

For development, use emoji or simple placeholders:

### Using Emoji

```typescript
// In App.tsx
<span className="text-lg">🐝</span>  // Bee
<span className="text-lg">👑</span>  // Queen
```

### Creating Simple Placeholder SVG

```svg
<!-- icon.svg -->
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Simple hexagon with bee -->
  <polygon points="256,0 512,128 512,384 256,512 0,384 0,128"
           fill="#FDB913" stroke="#8B6116" stroke-width="8"/>
  <circle cx="256" cy="256" r="60" fill="#8B6116"/>
  <circle cx="230" cy="240" r="8" fill="#FFFBF0"/>
  <circle cx="282" cy="240" r="8" fill="#FFFBF0"/>
</svg>
```

## Converting Assets

### PNG to ICO (Windows)

Using ImageMagick:
```bash
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

Or use online: [icoconvert.com](https://icoconvert.com/)

### PNG to ICNS (macOS)

Using sips:
```bash
sips -s format icns icon.png -o icon.icns
```

Or use: [CloudConvert](https://cloudconvert.com/)

## Where to Place Icons

```
TheHive/
├── assets/
│   ├── icon.png
│   ├── icon.ico
│   ├── icon.icns
│   ├── tray-icon.png
│   └── tray-icon@2x.png
```

## Using Icons in Code

### Application Icon

```typescript
// main.ts
import { nativeImage } from 'electron';
import path from 'path';

function getIcon() {
  if (process.platform === 'darwin') {
    return nativeImage.createFromPath(
      path.join(__dirname, '../../assets/icon.icns')
    );
  } else if (process.platform === 'win32') {
    return nativeImage.createFromPath(
      path.join(__dirname, '../../assets/icon.ico')
    );
  }
  return nativeImage.createFromPath(
    path.join(__dirname, '../../assets/icon.png')
  );
}

const mainWindow = new BrowserWindow({
  icon: getIcon(),
});
```

### Tray Icon

```typescript
const tray = new Tray(
  nativeImage.createFromPath(
    path.join(__dirname, '../../assets/tray-icon.png')
  )
);
```

## Image Optimization

### PNG Optimization

Using ImageOptim (macOS) or TinyPNG online:
- Target: < 50KB per image
- Keep transparency
- Maintain quality

### Icon Design Principles

```
✓ Scalable (vector preferred)
✓ Simple (recognizable at small sizes)
✓ 16×16 to 512×512 compatible
✓ Works on light and dark backgrounds
✓ Unique and memorable
✓ Consistent with brand colors
```

## Testing Icons

```bash
# View icon on macOS
sips -i icon.png

# View icon on Windows
# Right-click file → Properties

# Test with electron
npm run dev
# Icon should appear in window title bar and taskbar
```

## Resources

### Icon Websites
- [Noun Project](https://thenounproject.com/)
- [OpenMoji](https://openmoji.org/)
- [Emojipedia](https://emojipedia.org/)
- [Icons8](https://icons8.com/)

### Icon Tools
- [Favicon Generator](https://www.favicon-generator.org/)
- [ToImage.io](https://toimage.io/)
- [IconShock](https://www.iconshock.com/)

### Electron Icon Best Practices
- Use high resolution source (2x size minimum)
- Test on actual target OS
- Validate file size
- Check transparency rendering
- Test in system tray

---

Once you add icons to `assets/` directory, Electron will automatically pick them up during build.