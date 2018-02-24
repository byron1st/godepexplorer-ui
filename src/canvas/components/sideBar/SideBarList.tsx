import * as React from 'react'
import { Node } from '../../../GlobalTypes'

type SideBarListProps = {
  header: string
  nodeSet: { [key: string]: Node }
}

type SideBarListItemProps = {
  node: Node
}

export default class SideBarList extends React.Component<SideBarListProps> {
  render () {
    return (
      <div>
        <h3 className='text-light'>{this.props.header}</h3>
        <ul className='list-group'>
          {
            Object.values(this.props.nodeSet).map(node => <SideBarListItem node={node} />)
          }
        </ul>
      </div>
    )
  }
}

const SideBarListItem = (props: SideBarListItemProps) => (
  <li className='list-group-item bg-dark text-light'>{props.node.label}</li>
)
