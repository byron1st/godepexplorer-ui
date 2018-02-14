import { app, ipcMain, BrowserWindow, App } from 'electron'
import * as url from 'url'
import * as path from 'path'
import * as util from './util'
import * as constants from '../constants'
import godepexplorer from './connectors/godepexplorer'

// Declare global variables
const CanvasIndexUrl = url.format({
  pathname: path.join(__dirname, '../canvas/index.html'),
  protocol: 'file:',
  slashes: true,
})

const InfopanelIndexUrl = url.format({
  pathname: path.join(__dirname, '../infopanel/index.html'),
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
  // Attach dev tools to the windows
  BrowserWindow.addDevToolsExtension(util.getReactDevToolPath())

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

  // Async event subscribers
  ipcMain.on(IPC.GetInitDir.Request, (event: any, data: any) => {
    // Connect to godepexplorer
    godepexplorer.send(JSON.stringify(data), '/dir')
    .then(responseData => {
      const dirStructure = JSON.parse(responseData)

      // Return
      event.sender.send(IPC.GetInitDir.Response, dirStructure)
    })
  })

  ipcMain.on(IPC.ExpandPkgStruct.Request, (event: any, data: any) => {
    // Connect to godepexplorer
    godepexplorer.send(JSON.stringify(data), '/dep')
    .then(responseData => {
      const pkgStructure = JSON.parse(responseData)

      // Return
      event.sender.send(IPC.ExpandPkgStruct.Response, pkgStructure)
    })
  })
}

// Running scripts
initializeApp(app)
initializeIPC()
