import * as React from 'react'
import * as ReactDOM from 'react-dom'
import GoDepVisNetwork from '../visnetwork.godep'
import * as ipc from '../ipc'
import { Graph } from '../../types'
import MenuBar from './MenuBar'
import SideBar from './SideBar'
import InfoPanel from './InfoPanel'
import VisCanvas from './VisCanvas'

const VisNetworkCompID = 'vis-canvas'

interface Store {
  sideBarWidth: number,
  showInfoGraph: Graph
}

class Container extends React.Component<{}, Store> {
  godepVisNetwork = new GoDepVisNetwork(this.showInfo.bind(this))

  constructor (props: {}) {
    super(props)

    // initialize the store
    this.state = {
      sideBarWidth: 300,
      showInfoGraph: {
        nodes: [],
        edges: []
      }
    }

    ipc.initializeIPC(this.godepVisNetwork)
  }

  componentDidMount () {
    this.godepVisNetwork.initNetwork(document.getElementById(VisNetworkCompID))
  }

  showInfo (graph: Graph) {
    this.setState({ showInfoGraph: graph })
  }

  updateSideBarWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.setState({ sideBarWidth: this.state.sideBarWidth + delta.width })
  }

  render() {
    return [
      <MenuBar resetGraph={this.godepVisNetwork.resetGraph.bind(this.godepVisNetwork)} key='canvas-menubar' />,
      <SideBar width={this.state.sideBarWidth} updateWidth={this.updateSideBarWidth.bind(this)} key='canvas-sidebar' />,
      <InfoPanel sideBarWidth={this.state.sideBarWidth} graph={this.state.showInfoGraph} key='canvas-infopanel' />,
      <VisCanvas compID={VisNetworkCompID} key='canvas-viscanvas' />
    ]
  }
}

ReactDOM.render(<Container />, document.getElementById("container"))