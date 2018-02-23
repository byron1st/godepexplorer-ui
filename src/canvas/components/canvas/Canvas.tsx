import * as React from 'react'
import VisNetwork from './VisNetwork'

type CanvasProps = {
  compID: string
}

export default (props: CanvasProps) => (
  <div style={style.container}>
    <div id={props.compID} style={style.canvas} key='canvas-vis' />,
    <VisNetwork compID={props.compID} />
  </div>
)

const style = {
  container: {
    width: 'inherit',
    height: 'inherit',
    marginTop: '-150px'
  },
  canvas: {
    width: 'inherit',
    height: 'inherit'
  }
}