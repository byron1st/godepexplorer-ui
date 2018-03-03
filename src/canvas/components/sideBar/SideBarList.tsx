import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import SideBarListItem from './SideBarListItem'

interface ISideBarListProps {
  header: string
  visibleList: string[]
  invisibleList: string[]
  selectedSet: { [key: string]: boolean }
}

export default (props: ISideBarListProps) => (
  <div className="card" style={style.card}>
    <div className="card-header">{props.header}</div>
    <div className="card-body" style={style.cardBody}>
      <h6 className="card-title">Visible Nodes</h6>
      <div className="list-group">
        {props.visibleList.map(id => (
          <SideBarListItem
            id={id}
            isVisible={true}
            isClickable={true}
            isSelected={props.selectedSet[id] ? true : false}
            key={`${id}-sidebarbutton`}
          />
        ))}
      </div>
    </div>
    <div className="card-body" style={style.cardBody}>
      <h6 className="card-title">Invisible Nodes</h6>
      <div className="list-group">
        {props.invisibleList.map(id => (
          <SideBarListItem
            id={id}
            isVisible={false}
            isClickable={false}
            isSelected={props.selectedSet[id] ? true : false}
            key={`${id}-sidebarbutton`}
          />
        ))}
      </div>
    </div>
  </div>
)

const style = {
  card: {
    marginBottom: '10px'
  },
  cardBody: {
    paddingTop: '10px',
    paddingBottom: '10px'
  }
}
