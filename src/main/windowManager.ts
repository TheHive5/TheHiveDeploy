import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private readonly WINDOW_SIZE = { width: 800, height: 600 };

  public createMainWindow(): BrowserWindow {
    if (this.mainWindow) {
      this.mainWindow.focus();
      return this.mainWindow;
    }

    this.mainWindow = new BrowserWindow({
      ...this.WINDOW_SIZE,
      frame: true,
      transparent: false,
      alwaysOnTop: false,
      resizable: true,
      skipTaskbar: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    this.setupWindowEvents();
    this.loadAppContent();
    this.positionWindow();

    return this.mainWindow;
  }

  private setupWindowEvents(): void {
    if (!this.mainWindow) return;

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private loadAppContent(): void {
    if (!this.mainWindow) return;

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
  }

  private positionWindow(): void {
    if (!this.mainWindow) return;

    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workAreaSize;
    
    const x = Math.round((width - this.WINDOW_SIZE.width) / 2);
    const y = Math.round((height - this.WINDOW_SIZE.height) / 2);

    this.mainWindow.setPosition(x, y);
  }

  public toggleWindow(): void {
    if (!this.mainWindow) {
      this.createMainWindow();
      return;
    }

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  public getWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}