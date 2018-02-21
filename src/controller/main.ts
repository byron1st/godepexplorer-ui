import { app, ipcMain, BrowserWindow, App } from 'electron'
import * as url from 'url'
import * as path from 'path'
import * as util from './util'
import * as constants from '../constants'
import godepexplorer from './connectors/godepexplorer'
import * as types from '../types'

// Declare global variables
const CanvasIndexUrl = url.format({
  pathname: path.join(__dirname, '../canvas/index.html'),
  protocol: 'file:',
  slashes: true,
})

let canvasWindow: Electron.BrowserWindow

// Declare global functions
function createCanvasWindow () {
  const windowOpts = {
    height: 600,
    width: 800
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

function initializeApp (app: App) {
  // Subscribe the app events
  app.on('ready', createCanvasWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (canvasWindow === null) {
      createCanvasWindow()
    }
  })
}

function initializeIPC () {
  const IPC = constants.IPC

  // Connect to Godepexplorer
  ipcMain.on(IPC.GetDepOfPkg.Request, getBasicHandlerForGodepexplorer('/dep', IPC.GetDepOfPkg.Response))
}

function getBasicHandlerForGodepexplorer (targetPath: string, returnEventType: string) {
  return (event: any, pkgName: string) => {
    const data: types.Request = { pkgName }

    // Connect to godepexplorer
    godepexplorer.send(JSON.stringify(data), targetPath)
    .then(responseData => {
      const dirStruct: types.Response = JSON.parse(responseData)

      // Return
      event.sender.send(returnEventType, dirStruct)
    })
  }
}

// Running scripts
initializeApp(app)
initializeIPC()
