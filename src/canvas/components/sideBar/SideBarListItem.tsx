import { remote } from 'electron'
import * as React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { State, Graph } from 'godeptypes'
import { dataActions } from '../../Actions'
import DataSet from '../../DataSet'

interface ISideBarListItemProps {
  id: string
  isClickable: boolean
  isVisible: boolean
  isSelected: boolean
  selected: State.ISelectedState
  select: (selected: State.ISelectedState) => any
  deselect: (deselected: State.ISelectedState) => any
  showNode: (id: string, pkgType: Graph.PkgType) => any
  hideNode: (id: string, pkgType: Graph.PkgType) => any
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
      this.getMenuTemplate(
        this.props.id,
        this.props.showNode,
        this.props.hideNode
      )
    )

    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  private getMenuTemplate(
    id: string,
    showNode: (id: string, pkgType: Graph.PkgType) => any,
    hideNode: (id: string, pkgType: Graph.PkgType) => any
  ) {
    const selectedNodeList = this.props.selected.nodeList
    if (this.props.isClickable) {
      return [
        {
          label: 'Hide',
          click() {
            _.forEach(selectedNodeList, nodeID =>
              hideNode(nodeID, DataSet.getNode(nodeID).meta.pkgType)
            )
          }
        }
      ]
    } else {
      return [
        {
          label: 'Show',
          click() {
            _.forEach(selectedNodeList, nodeID =>
              showNode(nodeID, DataSet.getNode(nodeID).meta.pkgType)
            )
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

function mapStateToProps(state: State.IRootState) {
  return {
    selected: state.data.selected
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
    showNode: (id: string, pkgType: Graph.PkgType) => {
      dispatch(dataActions.showNode(id, pkgType))
    },
    hideNode: (id: string, pkgType: Graph.PkgType) => {
      dispatch(dataActions.hideNode(id, pkgType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)
