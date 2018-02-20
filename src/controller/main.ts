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

const InfopanelIndexUrl = url.format({
  pathname: path.join(__dirname, '../infopanel/index.html'),
  protocol: 'file:',
  slashes: true,
})

let canvasWindow: Electron.BrowserWindow
let infopanelWindow: Electron.BrowserWindow & { initialData?: any }

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
    BrowserWindow.addDevToolsExtension(util.getReactDevToolPath())
  }

  canvasWindow.loadURL(CanvasIndexUrl)
  canvasWindow.webContents.openDevTools()

  // Subscribe the window events
  canvasWindow.on('closed', () => {
    canvasWindow = null
  })
}

function createInfopanelWindow (initialData?: any) {
  const windowOpts = {
    height: 400,
    width: 600
  }

  infopanelWindow = new BrowserWindow(windowOpts)

  if (initialData) {
    infopanelWindow.initialData = initialData
  }

  infopanelWindow.loadURL(InfopanelIndexUrl)
  infopanelWindow.webContents.openDevTools()

  infopanelWindow.on('closed', () => {
    infopanelWindow = null
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
