import { WindowManager } from './windowManager';
import { TrayManager } from './trayManager';

// Use dynamic require to ensure Electron is loaded in main process context
let app: any, BrowserWindow: any, ipcMain: any, nativeTheme: any;

function loadElectron() {
  try {
    const electronModule = require('electron');
    if (typeof electronModule === 'string') {
      // This means we got the executable path, not the module
      throw new Error('Electron module resolution failed');
    }
    app = electronModule.app;
    BrowserWindow = electronModule.BrowserWindow;
    ipcMain = electronModule.ipcMain;
    nativeTheme = electronModule.nativeTheme;
    return true;
  } catch (e) {
    console.error('Failed to load electron:', e);
    return false;
  }
}

if (!loadElectron()) {
  console.error('FATAL: Could not load Electron module. This must run as Electron main process.');
  process.exit(1);
}

class HiveApp {
  private windowManager: WindowManager;
  private trayManager: TrayManager;

  constructor() {
    this.windowManager = new WindowManager();
    this.trayManager = new TrayManager(this.windowManager);
    this.setupAppLifecycle();
    this.setupIPC();
  }

  private setupAppLifecycle(): void {
    app.whenReady().then(() => {
      this.windowManager.createMainWindow();
      this.trayManager.createTray();
      
      // Force dark theme for consistent styling
      nativeTheme.themeSource = 'dark';
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.windowManager.createMainWindow();
      }
    });

    // Single instance lock
    if (!app.requestSingleInstanceLock()) {
      app.quit();
    }
  }

  private setupIPC(): void {
    ipcMain.handle('get-app-version', () => app.getVersion());
    ipcMain.handle('restart-app', () => app.relaunch());
  }
}

new HiveApp();