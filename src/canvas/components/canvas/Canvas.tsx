import * as React from 'react'
import VisNetwork from './VisNetwork'

type CanvasProps = {
  compID: string
}

export default (props: CanvasProps) => (
  <div style={style}>
    <div id={props.compID} style={style} key='canvas-vis' />,
    <VisNetwork compID={props.compID} />
  </div>
)

const style = {
  width: 'inherit',
  height: 'inherit',
  margin: 0
}