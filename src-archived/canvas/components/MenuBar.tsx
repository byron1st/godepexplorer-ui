import * as React from 'react'
import { remote } from 'electron'
import GoDepVisNetwork from '../visnetwork.godep'
import * as ipc from '../ipc'

export default class MenuBar extends React.Component<{ resetGraph: () => void }> {
  state = {
    rootPath: ''
  }

  loadPackage () {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filepaths: string[]) => {
      if (filepaths) {
        const rootPath = extractRootPath(filepaths[0])
        if (rootPath) {
          ipc.sendDepReq(rootPath)
          this.setState({ rootPath })
        }
      }
    })
  }

  render () {
    return (
      <nav className='navbar fixed-top navbar-expand-sm navbar-dark bg-dark'>
        <div className='navbar-brand'>GoDepExplorer UI{/*TODO: prop으로 추출*/}</div>
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#mainMenu' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        {
          // TODO: ******* MenuList 형태로 추출 *******
        }
        <div className='collapse navbar-collapse' id='mainMenu'>
          <div className='navbar-nav'>
              <a className='nav-item nav-link' onClick={this.loadPackage.bind(this)}>Load</a>
              <a className='nav-item nav-link' onClick={this.props.resetGraph}>Reset</a>
          </div>
        </div>
        <span className='navbar-text'>{this.state.rootPath}</span>
        {
          // *********************************
        }
      </nav>
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