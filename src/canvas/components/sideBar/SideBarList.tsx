import * as React from 'react'
import { connect } from 'react-redux'
import { Node, Edge, ElementSet, SetGraph } from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { RootState } from '../../Reducers'
import SideBarListItem from './SideBarListItem'

type SideBarListProps = {
  header: string
  nodeSet: ElementSet<Node>
  selectedNodeSet: ElementSet<Node>
}

export default class SideBarList extends React.Component<SideBarListProps> {
  render () {
    return (
      <div>
        <h3 className='text-light'>{this.props.header}</h3>
        <div className='list-group'>
          {
            Object.values(this.props.nodeSet).map(node => <SideBarListItem node={node} selectedNodeSet={this.props.selectedNodeSet} />)
          }
        </div>
      </div>
    )
  }
}