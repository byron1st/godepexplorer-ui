import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import SideBarListItem from './SideBarListItem'

interface ISideBarListProps {
  header: string
  nodeIDList: string[]
  isVisible: boolean
  isClickable: boolean
  selectedSet: { [key: string]: boolean }
}

export default (props: ISideBarListProps) => (
  <div>
    <h3 className="text-light">{props.header}</h3>
    <div className="list-group">
      {props.nodeIDList.map(id => (
        <SideBarListItem
          id={id}
          isVisible={props.isVisible}
          isClickable={props.isClickable}
          isSelected={props.selectedSet[id] ? true : false}
          key={`${id}-sidebarbutton`}
        />
      ))}
    </div>
  </div>
)
