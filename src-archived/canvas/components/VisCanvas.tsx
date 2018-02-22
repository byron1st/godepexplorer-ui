import * as vis from 'vis'
import * as React from 'react'
import { Graph, Node, Edge } from '../../types'
import GoDepVisNetwork from '../visnetwork.godep'

export default class VisCanvas extends React.Component<{compID: string}> {
  render () {
    return <div id={this.props.compID} style={style} key='canvas-vis' />
  }
}

const style = {
  width: 'inherit',
  height: 'inherit',
  margin: 0
}