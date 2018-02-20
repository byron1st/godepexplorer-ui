import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as godepvis from '../visnetwork.godep'
import * as ipc from '../ipc'
import MenuBar from './MenuBar'
import SideBar from './SideBar'
import InfoPanel from './InfoPanel'

const VisNetworkComp = 'vis-canvas'

class Container extends React.Component {
  state = {
    sideBarWidth: 300
  }

  constructor (props: {}) {
    super(props)

    ipc.initializeIPC()
  }

  componentDidMount () {
    godepvis.default.initNetwork(document.getElementById(VisNetworkComp))
    // ipc.sendTestReq()
  }

  updateSideBarWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.setState({ sideBarWidth: this.state.sideBarWidth + delta.width })
  }

  render() {
    return [
      <MenuBar key='canvas-menubar' />,
      <SideBar width={this.state.sideBarWidth} updateWidth={this.updateSideBarWidth.bind(this)} />,
      <InfoPanel sideBarWidth={this.state.sideBarWidth} />,
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