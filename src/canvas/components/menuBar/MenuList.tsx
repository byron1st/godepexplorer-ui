import * as React from 'react'
import { remote } from 'electron'
import * as IPC from '../../ipc'

export default class MenuList extends React.Component {
  loadPackage () {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filepaths: string[]) => {
      if (filepaths) {
        const rootPath = extractRootPath(filepaths[0])
        if (rootPath) {
          IPC.sendDepReq(rootPath)
        }
      }
    })
  }

  render () {
    return (
      <div className='collapse navbar-collapse' id='mainMenu'>
        <div className='navbar-nav'>
            <a className='nav-item nav-link' onClick={this.loadPackage.bind(this)}>Load</a>
            {
              // <a className='nav-item nav-link' onClick={this.props.resetGraph}>Reset</a>
            }
        </div>
      </div>
    )
  }
}

function extractRootPath (filePath: string) {
  const gopath = process.env.GOPATH

  if (gopath) {
    if (filePath.startsWith(`${gopath}/src`)) {
      return filePath.slice(`${gopath}/src`.length + 1)
    } else {
      remote.dialog.showErrorBox('Error', 'Directory should be inside $GOPATH/src')
    }
  } else {
    remote.dialog.showErrorBox('Error', 'GOPAHT is not set.')
  }
}