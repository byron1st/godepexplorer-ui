import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as visnetwork from '../visnetwork'

const htmlElementID = {
  visCanvas: 'vis-canvas',
  infoPanel: 'info-panel'
}

class Container extends React.Component {
  componentDidMount () {
    const htmlVisCanvas = document.getElementById(htmlElementID.visCanvas)
    const htmlInfoPanel = document.getElementById(htmlElementID.infoPanel)

    visnetwork.init({ visnetwork: htmlVisCanvas, details: htmlInfoPanel })
  }

  render() {
    return [
      <div id={htmlElementID.infoPanel} style={style.infoPanel} />,
      <div id={htmlElementID.visCanvas} style={style.visCanvas} />
    ]
  }
}

const style = {
  infoPanel: {
    backgroundColor: 'aqua',
    width: '300px',
    zIndex: 100,
    // position: 'fixed',
    // overflowY: 'scroll'
  },
  visCanvas: {
    height: '100%',
    width: '100%',
    margin: '0 auto',
    padding: 0,
    backgroundColor: 'lightgray',
    float: 'left'
  }
}

ReactDOM.render(<Container />, document.getElementById("container"))