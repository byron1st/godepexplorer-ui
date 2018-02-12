import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import * as constants from '../../constants'

class Container extends React.Component {
  constructor (props: {}) {
    super(props)

    initializeIPC()
  }

  render () {
    return (
      <div>
        <h1>Hello World!</h1>
      </div>
    )
  }
}

function initializeIPC () {
  const IPC = constants.IPC

  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStructure: any) => {
    // TODO: do something.
    console.log(dirStructure)
  })

  // For Test
  ipcRenderer.send(IPC.GetInitDir.Request, {pkgName: 'github.com/hyperledger/fabric/peer'})
}

ReactDOM.render(<Container />, document.getElementById("container"))