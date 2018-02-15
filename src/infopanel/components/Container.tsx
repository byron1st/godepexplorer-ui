import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { remote } from 'electron'

class Container extends React.Component {
  render() {
    return <h1>Hello World!</h1>
  }
}

const style = {
}

const window: Electron.BrowserWindow & { initialData?: any } = remote.getCurrentWindow()
console.log(window.initialData)

ReactDOM.render(<Container />, document.getElementById("container"))