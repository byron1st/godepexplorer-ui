import * as React from 'react'
import VisNetwork from './VisNetwork'

interface ICanvasProps {
  compID: string
}

export default (props: ICanvasProps) => (
  <div style={style.container}>
    <div id={props.compID} style={style.canvas} key="canvas-vis" />,
    <VisNetwork compID={props.compID} />
  </div>
)

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
