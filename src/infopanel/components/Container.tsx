import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { remote } from 'electron'
import { GraphElements, Node, Edge } from '../../types'
import * as ipc from '../ipc'
import {InfoTable} from './InfoTable'

class Container extends React.Component<{}, GraphElements<Node, Edge>> {
  constructor (props: {}) {
    super(props)

    // Initialize the state
    this.state = {
      nodes: [],
      edges: []
    }

    ipc.initializeIPC(this.update.bind(this))
  }

  update (graphElements: GraphElements<Node, Edge>) {
    this.setState({ nodes: graphElements.nodes, edges: graphElements.edges })
  }

  componentDidMount () {
    const window: Electron.BrowserWindow & { initialData?: any } = remote.getCurrentWindow()
    if (window.initialData) {
      this.update(window.initialData)
    }
  }

  render () {
    console.log(this.state)
    if (this.state.nodes[0]) {
      const data = {
        id: this.state.nodes[0].id,
        isPkg: this.state.nodes[0].isPkg,
        packageDir: this.state.nodes[0].packageDir,
        packagePath: this.state.nodes[0].packagePath
      }
      return <InfoTable data={[data]} />
    }
    return null
  }
}

const style = {
  table: {
    margin: '10px'
  }
}

ReactDOM.render(<Container />, document.getElementById("container"))