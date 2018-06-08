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
const GodepexplorerVersion = '0.1.0'

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
    const reactDevTool = util.getDevToolPath(util.ReactDevAppID)
    if (reactDevTool) {
      BrowserWindow.addDevToolsExtension(reactDevTool)
    }

    const reduxDevTool = util.getDevToolPath(util.ReduxDevAppID)
    if (reduxDevTool) {
      BrowserWindow.addDevToolsExtension(reduxDevTool)
    }
  }

  canvasWindow.loadURL(CanvasIndexUrl)

  // TODO: move to main menu
  // TODO: add dev flag
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

    execFile('godepexplorer', ['-v'], (error, stdout) => {
      if (error) {
        return openNoGodepexplorerMessage()
      }

      const out = stdout.split(' ')
      if (out.length !== 3) {
        return openNoGodepexplorerMessage()
      }

      const version = out[2].trim()
      if (version !== GodepexplorerVersion) {
        return openNoGodepexplorerMessage()
      }

      // Only if there is godepexplorer installed,
      createCanvasWindow()
    })
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

function openNoGodepexplorerMessage() {
  dialog.showMessageBox(
    {
      message: 'There is no godepexplorer or wrong version.',
      detail:
        'You need to install 1) Go and 2) godepexplorer.\nAfter you install Go, you can get godepexplorer by running "go get github.com/byron1st/godepexplorer".\nThen, you should run "go install" on the project directory.',
      type: 'error',
      buttons: ['Quit']
    },
    () => {
      app.quit()
    }
  )
}

function initializeIPC() {
  ipcMain.on(IPCType.GetDepOfPkg.Request, sendRequestToGodepexplorer)
}

function sendRequestToGodepexplorer(event: any, pkgName: string) {
  const depPath = path.join(app.getPath('appData'), app.getName(), 'dep.json')
  fs.closeSync(fs.openSync(depPath, 'w'))

  // TODO: Add more algorithm in addition to static
  execFile(
    'godepexplorer',
    ['extract', pkgName, '--output', depPath],
    getResponseHandler(event, depPath)
  )
}

function getResponseHandler(event: any, depPath: string) {
  return (error: Error | null, stdout: string, stderr: string): void => {
    if (error) {
      dialog.showErrorBox('Error during executing godepexplorer', stderr)
      event.sender.send(IPCType.GetDepOfPkg.Response)
      return
    }

    const graph = JSON.parse(fs.readFileSync(depPath, 'utf-8'))
    event.sender.send(IPCType.GetDepOfPkg.Response, graph)
  }
}

// Running scripts
initializeApp()
initializeIPC()
