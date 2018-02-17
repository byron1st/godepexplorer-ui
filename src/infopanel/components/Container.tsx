import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { remote } from 'electron'
import { Graph, Node, Edge } from '../../types'
import * as ipc from '../ipc'
import {InfoTable} from './InfoTable'

class Container extends React.Component<{}, Graph> {
  constructor (props: {}) {
    super(props)

    // Initialize the state
    this.state = {
      nodes: [],
      edges: []
    }

    ipc.initializeIPC(this.update.bind(this))
  }

  update (graph: Graph) {
    this.setState({ nodes: graph.nodes, edges: graph.edges })
  }

  componentDidMount () {
    const window: Electron.BrowserWindow & { initialData?: any } = remote.getCurrentWindow()
    if (window.initialData) {
      this.update(window.initialData)
    }
  }

  render () {
    return [
      <InfoTable data={this.state.nodes} header='Nodes' key='nodes-info' />,
      <InfoTable data={this.state.edges} header='Edges' key='edges-info' />
    ]
  }
}

const style = {
  table: {
    margin: '10px'
  }
}

ReactDOM.render(<Container />, document.getElementById("container"))