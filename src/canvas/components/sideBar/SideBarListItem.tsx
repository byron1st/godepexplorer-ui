import { remote } from 'electron'
import * as React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { State, Graph } from 'godeptypes'
import { dataActions } from '../../Actions'
import DataSet from '../../DataSet'

interface ISideBarListItemProps {
  id: string
  index: number
  enclosingList: string[]
  isVisible: boolean
  isSelected: boolean
  selected: State.ISelectedState
  select: (selected: State.ISelectedState) => any
  deselect: (deselected: State.ISelectedState) => any
  showNode: (id: string, pkgType: Graph.PkgType) => any
  hideNode: (id: string, pkgType: Graph.PkgType) => any
  showInfo: (infoPanelData: State.ISelectedState) => any
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
          {DataSet.getNode(this.props.id).label}
        </a>
      </div>
    )
  }

  private click(e: any) {
    e.preventDefault()
    if (e.shiftKey) {
      const closestIndex = getClosestIndex(
        this.props.selected.nodeList,
        this.props.enclosingList,
        this.props.index
      )

      if (closestIndex !== -1) {
        const shiftSelectedNodeList = _.slice(
          this.props.enclosingList,
          closestIndex,
          this.props.index + 1
        )

        shiftSelectedNodeList.forEach(nodeID => this.select(nodeID))
      } else {
        this.select(this.props.id)
      }
    } else {
      this.select(this.props.id)
    }
  }

  private select(id: string) {
    const selected = DataSet.selectNode(id)

    this.props.isSelected
      ? this.props.deselect(selected)
      : this.props.select(selected)
  }

  private openContextMenu(e: any) {
    const menu = remote.Menu.buildFromTemplate(
      this.getMenuTemplate(
        this.props.id,
        this.props.showNode,
        this.props.hideNode,
        this.props.showInfo
      )
    )

    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
  }

  private getMenuTemplate(
    id: string,
    showNode: (id: string, pkgType: Graph.PkgType) => any,
    hideNode: (id: string, pkgType: Graph.PkgType) => any,
    showInfo: (infoPanelData: State.ISelectedState) => any
  ) {
    const selectedNodeList = this.props.selected.nodeList
    // TODO: meta.pkgType 부분.
    // pkgType을 base로 쓸 거면, meta가 아니라 상위에 존재할 필요 있음.
    return [
      {
        label: 'Show',
        click() {
          _.forEach(selectedNodeList, nodeID =>
            showNode(nodeID, DataSet.getNode(nodeID).meta.pkgType)
          )
        }
      },
      {
        label: 'Hide',
        click() {
          _.forEach(selectedNodeList, nodeID =>
            hideNode(nodeID, DataSet.getNode(nodeID).meta.pkgType)
          )
        }
      },
      {
        label: 'Show Info',
        click() {
          showInfo(DataSet.selectNode(id))
        }
      }
    ]
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

function getClosestIndex(
  selectedNodeList: string[],
  enclosingList: string[],
  currentNodeIndex: number
) {
  for (let i = currentNodeIndex; i >= 0; i--) {
    if (selectedNodeList.indexOf(enclosingList[i]) !== -1) {
      return i
    }
  }

  return -1
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
    },
    showInfo: (infoPanelData: State.ISelectedState) => {
      dispatch(dataActions.showInfo(infoPanelData))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)
