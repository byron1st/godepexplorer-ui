import * as React from 'react'
import SideBarListItem from './SideBarListItem'
import { ISideBarListItemData } from '../../reducers/Type'

interface ISideBarListProps {
  header: string
  listData: ISideBarListItemData[]
  selectedSet: { [key: string]: boolean }
  selectedNodeList: string[]
}

export default (props: ISideBarListProps) => (
  <div style={style.container}>
    <h4>{props.header}</h4>
    {props.listData.map((item, index, list) => (
      <SideBarListItem
        id={item.id}
        index={index}
        enclosingList={list.map(listItem => listItem.id)}
        isVisible={item.isVisible}
        isSelected={props.selectedSet[item.id] ? true : false}
        type={item.type}
        selectedNodeList={props.selectedNodeList}
        key={`${item.id}-sidebarbutton`}
      />
    ))}
  </div>
)

const style = {
  container: {
    paddingTop: 10,
    paddingBottom: 10
  }
}
