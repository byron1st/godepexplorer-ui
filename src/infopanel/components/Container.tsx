import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { remote } from 'electron'
import { GraphElements, Node, Edge } from '../../types'

class Container extends React.Component<{}, GraphElements<Node, Edge>> {
  constructor (props: {}) {
    super(props)

    // Initialize the state
    this.state = {
      nodes: [],
      edges: []
    }
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

  render() {
    console.log(this.state)
    return <table style={style.table}>

    </table>
  }
}

const style = {
  table: {
    margin: '10px'
  }
}

ReactDOM.render(<Container />, document.getElementById("container"))