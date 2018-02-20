import * as React from 'react'
import { remote } from 'electron'
import GoDepVisNetwork from '../visnetwork.godep'
import * as ipc from '../ipc'

export default class MenuBar extends React.Component<{goDepVisNetwork: GoDepVisNetwork}> {
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
          this.props.goDepVisNetwork.resetGraph()
          // ipc.sendGetInitDir(rootPath)
          ipc.sendExpandingReq(rootPath)
          this.setState({ rootPath })
        }
      }
    })
  }

  render () {
    return (
      <nav className='navbar fixed-top navbar-dark bg-dark'>
        <div className='navbar-brand'>Canvas</div>
        <div className='form-inline'>
          <button className='btn btn-primary' onClick={this.loadPackage.bind(this)}>Load</button>
          <input type='text' readOnly className='form-control ml-3' value={this.state.rootPath} />
        </div>
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