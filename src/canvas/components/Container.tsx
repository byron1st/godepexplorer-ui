import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as vis from '../visnetwork'
import * as ipc from '../ipc'

const VisNetworkComp = 'vis-canvas'

class Container extends React.Component {
  constructor (props: {}) {
    super(props)

    ipc.initializeIPC()
  }

  componentDidMount () {
    vis.init(document.getElementById(VisNetworkComp))
    ipc.sendTestReq()
  }

  render() {
    return <div id={VisNetworkComp} style={style} />
  }
}

const style = {
  width: 'inherit',
  height: 'inherit',
  margin: 0
}

ReactDOM.render(<Container />, document.getElementById("container"))