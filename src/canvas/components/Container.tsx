import * as React from 'react'
import * as ReactDOM from 'react-dom'
import GoDepVisNetwork from '../visnetwork.godep'
import * as ipc from '../ipc'
import {Graph} from '../../types'
import MenuBar from './MenuBar'
import SideBar from './SideBar'
import InfoPanel from './InfoPanel'

const VisNetworkComp = 'vis-canvas'

interface Store {
  sideBarWidth: number,
  showInfoGraph: Graph,
  goDepVisNetwork: GoDepVisNetwork
}

class Container extends React.Component<{}, Store> {
  constructor (props: {}) {
    super(props)

    // initialize the store
    this.state = {
      sideBarWidth: 300,
      showInfoGraph: {
        nodes: [],
        edges: []
      },
      goDepVisNetwork: new GoDepVisNetwork(this.showInfo.bind(this))
    }

    ipc.initializeIPC(this.state.goDepVisNetwork)
  }

  componentDidMount () {
    this.state.goDepVisNetwork.initNetwork(document.getElementById(VisNetworkComp))
  }

  showInfo (graph: Graph) {
    this.setState({ showInfoGraph: graph })
  }

  updateSideBarWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.setState({ sideBarWidth: this.state.sideBarWidth + delta.width })
  }

  render() {
    return [
      <MenuBar key='canvas-menubar' goDepVisNetwork={this.state.goDepVisNetwork} />,
      <SideBar width={this.state.sideBarWidth} updateWidth={this.updateSideBarWidth.bind(this)} />,
      <InfoPanel sideBarWidth={this.state.sideBarWidth} graph={this.state.showInfoGraph} />,
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