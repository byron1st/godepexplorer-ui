import { app, BrowserWindow } from "electron"
import * as path from "path"
import * as url from "url"
import * as os from 'os'
import * as fs from 'fs'

let mainWindow: Electron.BrowserWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  })

  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
  }))

  const reactDevToolPath = getReactDevToolPath()
  BrowserWindow.addDevToolsExtension(reactDevToolPath)
  mainWindow.webContents.openDevTools()

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

function getReactDevToolPath (): string {
  const appID = 'fmkadmapgofadopljbjfkapdkoienihi'
  const appPath = getAppPath(appID)

  const appVersion = fs.readdirSync(appPath)
  .filter(file => fs.statSync(path.join(appPath, file)).isDirectory())
  .sort((prev, next) => {
    if (next > prev) return 1
    else return -1
  })[0]

  return path.join(appPath, appVersion)
}

function getAppPath (appID: string): string {
  if (os.platform() === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'Default', 'Extensions', appID)
  } else if (os.platform() === 'win32') {
    return path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', appID)
  } else {
    return path.join(os.homedir(), '.config', 'google-chrome', 'Default', 'Extensions', appID)
  }
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})