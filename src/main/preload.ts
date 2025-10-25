import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  restartApp: () => ipcRenderer.invoke('restart-app'),
  onAppUpdate: (callback: (version: string) => void) =>
    ipcRenderer.on('app-update', (_event, version) => callback(version))
});

// Type definition for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      restartApp: () => Promise<void>;
      onAppUpdate: (callback: (version: string) => void) => void;
    };
  }
}