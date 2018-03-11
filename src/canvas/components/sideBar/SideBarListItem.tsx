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
  deselect: (deselected: State.ISelectedState) => any
  changeVisibility: (id: string, toShow: boolean, pkgType: Graph.PkgType) => any
}

class SideBarListItem extends React.Component<ISideBarListItemProps> {
  constructor(props: ISideBarListItemProps) {
    super(props)

    this.openContextMenu = this.openContextMenu.bind(this)
    this.click = this.click.bind(this)
  }

  public render() {
    return (
      <div
        onClick={this.click}
        onContextMenu={this.openContextMenu}
        style={style.item}
      >
        <a
          href="#"
          style={
            this.props.isSelected ? style.selectedText : style.unselectedText
          }
        >
          {DataSet.getNode(this.props.id).meta.pkgPath}
        </a>
      </div>
    )
  }

  private click() {
    const selected = DataSet.selectNode(this.props.id)

    this.props.isSelected
      ? this.props.deselect(selected)
      : this.props.select(selected)
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

const style = {
  item: {
    paddingTop: 0,
    paddingBottom: 0
  },
  unselectedText: {
    color: 'white'
  },
  selectedText: {
    color: '#18A8CD'
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    select: (selected: State.ISelectedState) => {
      dispatch(dataActions.select(selected))
    },
    deselect: (deselected: State.ISelectedState) => {
      dispatch(dataActions.deselect(deselected))
    },
    changeVisibility: (id: string, toShow: boolean, pkgType: Graph.PkgType) => {
      dispatch(dataActions.changeVisibility(id, toShow, pkgType))
    }
  }
}

export default connect(null, mapDispatchToProps)(SideBarListItem)
