import * as React from 'react'

type CanvasProps = {
  compID: string
}

export default (props: CanvasProps) => (
  <div id={props.compID} style={style} key='canvas-vis' />
)

const style = {
  width: 'inherit',
  height: 'inherit',
  margin: 0
}