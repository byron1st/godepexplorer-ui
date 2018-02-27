import { App, app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as types from '../GlobalTypes'
import * as IPCType from '../IPCTypes'
import godepexplorer from './connectors/godepexplorer'
import * as util from './util'

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
  app.on('ready', createCanvasWindow)

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
  // Connect to Godepexplorer
  ipcMain.on(
    IPCType.GetDepOfPkg.Request,
    getBasicHandlerForGodepexplorer('/dep', IPCType.GetDepOfPkg.Response)
  )
}

function getBasicHandlerForGodepexplorer(
  targetPath: string,
  returnEventType: string
) {
  return (event: any, pkgName: string) => {
    const data: types.IRequest = { pkgName }

    // Connect to godepexplorer
    godepexplorer
      .send(JSON.stringify(data), targetPath)
      .then(responseData => {
        const response: types.IResponse = JSON.parse(responseData)

        // Return
        event.sender.send(returnEventType, response.graph)
      })
      .catch(errorMessage => {
        dialog.showErrorBox('Error from the main process', errorMessage)
        event.sender.send(returnEventType)
      })
  }
}

// Running scripts
initializeApp()
initializeIPC()
