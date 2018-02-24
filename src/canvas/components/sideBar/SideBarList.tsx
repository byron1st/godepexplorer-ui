import * as React from 'react'
import { Node, ElementSetType } from '../../../GlobalTypes'

type SideBarListProps = {
  header: string
  nodeSet: ElementSetType<Node>
  selectedNodeSet: ElementSetType<Node>
}

type SideBarListItemProps = {
  node: Node
  selectedNodeSet: ElementSetType<Node>
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

const SideBarListItem = (props: SideBarListItemProps) => {
  let isActive = ''
  if (props.selectedNodeSet[props.node.id] !== undefined) {
    isActive = 'active'
  }
  return (
    <button type='button' className={`list-group-item list-group-item-action ${isActive}`}>{props.node.label}</button>
  )
}
