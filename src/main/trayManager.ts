import { Tray, Menu, app } from 'electron';
import * as path from 'path';
import { WindowManager } from './windowManager';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  public createTray(): void {
    // Use app icon from assets or a default
    const iconPath = path.join(__dirname, '../../assets/icon.png');
    this.tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show/Hide',
        click: () => {
          this.windowManager.toggleWindow();
        }
      },
      {
        label: 'Settings',
        click: () => {
          // Handle settings
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('The Hive - AI Bee Agent');

    // Toggle window on tray click
    this.tray.on('click', () => {
      this.windowManager.toggleWindow();
    });
  }

  public destroyTray(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}