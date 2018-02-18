import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as godepvis from '../visnetwork.godep'
import * as ipc from '../ipc'
import MenuBar from './MenuBar'

const VisNetworkComp = 'vis-canvas'

class Container extends React.Component {
  constructor (props: {}) {
    super(props)

    ipc.initializeIPC()
  }

  componentDidMount () {
    godepvis.default.initNetwork(document.getElementById(VisNetworkComp))
    ipc.sendTestReq()
  }

  render() {
    return [
      <MenuBar key='canvas-menubar' />,
      <div id={VisNetworkComp} style={style} key='canvas-vis' />
    ]
  }
}

const style = {
  width: 'inherit',
  height: 'inherit',
  margin: 0
}

ReactDOM.render(<Container />, document.getElementById("container"))