import * as React from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import * as IPC from '../../ipc'
import { graphActions } from '../../Actions'

type MenuListProps = {
  resetGraph: () => any
}

const MenuList = (props: MenuListProps) => (
  <div className='collapse navbar-collapse' id='mainMenu'>
    <div className='navbar-nav'>
        <a className='nav-item nav-link' onClick={openSelectDirectoryDialog}>Load</a>
        <a className='nav-item nav-link' onClick={props.resetGraph}>Reset</a>
    </div>
  </div>
)

function openSelectDirectoryDialog () {
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

function mapDispatchToProps (dispatch: any) {
  return {
    resetGraph: () => dispatch(graphActions.resetGraph())
  }
}

export default connect(null, mapDispatchToProps)(MenuList)