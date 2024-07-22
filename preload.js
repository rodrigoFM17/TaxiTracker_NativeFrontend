const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
'loader', {
  loadMain: () => ipcRenderer.invoke('loadMain'),
  loadLogin: () => ipcRenderer.invoke('loadLogin')
})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
  },)