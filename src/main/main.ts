import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { execFile } from 'child_process'
import * as IPCType from '../IPCTypes'
import * as util from './util'
import * as fs from 'fs'

// Declare global variables
const CanvasIndexUrl = url.format({
  pathname: path.join(__dirname, '../canvas/index.html'),
  protocol: 'file:',
  slashes: true
})

let canvasWindow: Electron.BrowserWindow

// Declare global functions
function createCanvasWindow() {
  const windowOpts = {
    height: 800,
    width: 1200
  }

  // Create the window for the canvas process
  canvasWindow = new BrowserWindow(windowOpts)
  if (BrowserWindow.getDevToolsExtensions() !== null) {
    // Attach dev tools to the windows
    const reactDevTool = util.getReactDevToolPath()
    if (reactDevTool) {
      BrowserWindow.addDevToolsExtension(reactDevTool)
    }

    const reduxDevTool = util.getReduxDevToolPath()
    if (reduxDevTool) {
      BrowserWindow.addDevToolsExtension(reduxDevTool)
    }
  }

  canvasWindow.loadURL(CanvasIndexUrl)
  canvasWindow.webContents.openDevTools()

  // Subscribe the window events
  canvasWindow.on('closed', () => {
    canvasWindow = null
  })
}

function initializeApp() {
  // Subscribe the app events
  app.on('ready', () => {
    globalShortcut.register('CommandOrControl+R', () => {
      // @ts-ignore
    })
    createCanvasWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (canvasWindow === null) {
      createCanvasWindow()
    }
  })
}

function initializeIPC() {
  ipcMain.on(IPCType.GetDepOfPkg.Request, sendRequestToGodepexplorer)
}

function sendRequestToGodepexplorer(event: any, pkgName: string) {
  const depPath = path.join(app.getPath('appData'), app.getName(), 'dep.json')
  fs.closeSync(fs.openSync(depPath, 'w'))

  // supported algorithm is only static for now.
  execFile(
    'godepexplorer',
    ['extract', pkgName, '--output', depPath],
    (error, stdout, stderr) => {
      if (error) {
        dialog.showErrorBox('Error during executing godepexplorer', stderr)
        event.sender.send(IPCType.GetDepOfPkg.Response)
        return
      }

      const graph = JSON.parse(fs.readFileSync(depPath, 'utf-8'))
      event.sender.send(IPCType.GetDepOfPkg.Response, graph)
    }
  )
}

// Running scripts
initializeApp()
initializeIPC()
