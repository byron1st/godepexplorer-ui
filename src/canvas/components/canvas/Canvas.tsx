import * as React from 'react'
import VisNetwork from '../../VisNetwork'

interface ICanvasProps {
  compID: string
}

const VisNetworkCompID = 'vis-canvas'

export default class Canvas extends React.Component {
  public componentDidMount() {
    // @ts-ignore document works well.
    VisNetwork.init(document.getElementById(VisNetworkCompID))
  }

  public render() {
    return (
      <div style={style.container}>
        <div id={VisNetworkCompID} style={style.canvas} key="canvas-vis" />,
      </div>
    )
  }
}

const style = {
  canvas: {
    height: 'inherit',
    width: 'inherit'
  },
  container: {
    height: 'inherit',
    marginTop: '-150px',
    width: 'inherit'
  }
}
