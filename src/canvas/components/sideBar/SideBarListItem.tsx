import { remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { State, Graph } from 'godeptypes'
import { dataActions } from '../../Actions'
import DataSet from '../../DataSet'

interface ISideBarListItemProps {
  id: string
  isClickable: boolean
  isVisible: boolean
  isSelected: boolean
  select: (selected: State.ISelectedState) => any
  changeVisibility: (id: string, toShow: boolean, pkgType: Graph.PkgType) => any
}

class SideBarListItem extends React.Component<ISideBarListItemProps> {
  constructor(props: ISideBarListItemProps) {
    super(props)

    this.openContextMenu = this.openContextMenu.bind(this)
    this.select = this.select.bind(this)
  }

  public render() {
    const isActive = this.props.isSelected ? 'active' : ''

    return (
      <button
        type="button"
        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive}`}
        onClick={this.props.isClickable ? this.select : null}
        onContextMenu={this.openContextMenu}
      >
        {DataSet.getNode(this.props.id).label}
        <span className="badge badge-secondary badge-pill">
          {this.props.isVisible ? '' : 'hidden'}
        </span>
      </button>
    )
  }

  private select() {
    this.props.select(DataSet.selectNode(this.props.id))
  }

  private openContextMenu(e: any) {
    const menu = remote.Menu.buildFromTemplate(
      this.getMenuTemplate(this.props.id, this.props.changeVisibility)
    )

    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  private getMenuTemplate(
    id: string,
    changeVisibility: (
      id: string,
      toShow: boolean,
      pkgType: Graph.PkgType
    ) => any
  ) {
    if (this.props.isClickable) {
      return [
        {
          label: 'Hide',
          click() {
            changeVisibility(id, false, DataSet.getNode(id).meta.pkgType)
          }
        }
      ]
    } else {
      return [
        {
          label: 'Show',
          click() {
            changeVisibility(id, true, DataSet.getNode(id).meta.pkgType)
          }
        }
      ]
    }
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    select: (selected: State.ISelectedState) => {
      dispatch(dataActions.select(selected))
    },
    changeVisibility: (id: string, toShow: boolean, pkgType: Graph.PkgType) => {
      dispatch(dataActions.changeVisibility(id, toShow, pkgType))
    }
  }
}

export default connect(null, mapDispatchToProps)(SideBarListItem)
