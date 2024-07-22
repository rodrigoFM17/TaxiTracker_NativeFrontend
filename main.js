const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('node:path')

const createWindow = (page) => {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(win => win.close())
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(`./pages/${page}/${page}.html`)
}

ipcMain.handle('loadMain', () => {
  createWindow('main')
  console.log('se pudo')
})

ipcMain.handle("loadLogin", () => {
  createWindow("login")
})


app.whenReady().then(() => {
  createWindow('login')

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

