import * as React from 'react'
import { connect } from 'react-redux'
import {
  IEdge,
  IElementSet,
  INode,
  ISetGraph,
  ISideBarElement
} from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { IRootState } from '../../Reducers'
import SideBarListItem from './SideBarListItem'

interface ISideBarListProps {
  header: string
  nodeList: ISideBarElement[]
  isVisible: boolean
  selectedNodeSet: IElementSet<INode>
  isClickable: boolean
}

export default class SideBarList extends React.Component<ISideBarListProps> {
  public render() {
    return (
      <div>
        <h3 className="text-light">{this.props.header}</h3>
        <div className="list-group">
          {this.props.nodeList.map(node => (
            <SideBarListItem
              node={node}
              isVisible={this.props.isVisible}
              selectedNodeSet={this.props.selectedNodeSet}
              key={node.id + 'sidebarbutton'}
              isClickable={this.props.isClickable}
            />
          ))}
        </div>
      </div>
    )
  }
}
