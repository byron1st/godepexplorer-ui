import * as React from 'react'
import SideBarListItem from './SideBarListItem'

interface ISideBarListProps {
  header: string
  visibleList: string[]
  invisibleList: string[]
  selectedSet: { [key: string]: boolean }
  selectedNodeList: string[]
}

export default (props: ISideBarListProps) => (
  <div style={style.container}>
    <h4>{props.header}</h4>
    {/* TODO: Visibile, Invisible. 이건 공통 요소로 놔둬도 될듯? */}
    <h6>Visible Nodes</h6>
    {props.visibleList.map((id, index, visibleList) => (
      <SideBarListItem
        id={id}
        index={index}
        enclosingList={visibleList}
        isVisible={true}
        isSelected={props.selectedSet[id] ? true : false}
        selectedNodeList={props.selectedNodeList}
        key={`${id}-sidebarbutton`}
      />
    ))}
    <h6>Invisible Nodes</h6>
    {props.invisibleList.map((id, index, invisibleList) => (
      <SideBarListItem
        id={id}
        index={index}
        enclosingList={invisibleList}
        isVisible={false}
        isSelected={props.selectedSet[id] ? true : false}
        selectedNodeList={props.selectedNodeList}
        key={`${id}-sidebarbutton`}
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
