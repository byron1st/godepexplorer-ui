import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'

export function getReactDevToolPath (): string {
  const appID = 'fmkadmapgofadopljbjfkapdkoienihi'
  return getDevToolPath(appID)
}

export function getReduxDevToolPath (): string {
  const appID = 'lmhkpmbekcpmknklioeibfkpmmfibljd'
  return getDevToolPath(appID)
}

function getDevToolPath (appID: string): string {
  const appPath = getAppPath(appID)

  if (appPath) {
    const appVersion = fs.readdirSync(appPath)
    .filter(file => fs.statSync(path.join(appPath, file)).isDirectory())
    .sort((prev, next) => {
      if (next > prev) return 1
      else return -1
    })[0]
  
    return path.join(appPath, appVersion)
  } else {
    return null
  }
}

function getAppPath (appID: string): string {
  for (let i = 0; i < 10; i++) {
    let appPath: string = ''
    let profile: string = ''
    if (i == 0) {
      profile = 'Default'
    } else {
      profile = `Profile ${i}`
    }

    if (os.platform() === 'darwin') {
      appPath = path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome', profile, 'Extensions', appID)
    } else if (os.platform() === 'win32') {
      appPath = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', profile, 'Extensions', appID)
    } else {
      appPath = path.join(os.homedir(), '.config', 'google-chrome', profile, 'Extensions', appID)
    }

    if (fs.existsSync(appPath)) {
      return appPath
    }
  }

  return ''
}