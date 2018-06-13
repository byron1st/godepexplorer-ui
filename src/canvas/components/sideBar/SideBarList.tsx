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
    <h5 style={style.header}>{props.header}</h5>
    <div style={style.packageListContainer}>
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
  </div>
)

const style = {
  container: {
    height: '100%',
    paddingTop: 10,
    paddingBottom: 10
  },
  header: {
    color: 'white'
  },
  packageListContainer: {
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#DFEBF7',
    borderRadius: '0.25rem'
  }
}
