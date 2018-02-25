import { remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IEdge, IElementSet, INode, ISetGraph } from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { IRootState } from '../../Reducers'

interface ISideBarListItemProps {
  node: INode
  selectedNodeSet: IElementSet<INode>
  elementSet: ISetGraph
  isClickable: boolean
  selectElement: (selectionSet: ISetGraph) => any
  changeSingleNodeVisible: (node: INode) => any
}

class SideBarListItem extends React.Component<ISideBarListItemProps> {
  constructor(props: ISideBarListItemProps) {
    super(props)

    this.openContextMenu = this.openContextMenu.bind(this)
  }
  public render() {
    let isActive = ''
    if (this.props.selectedNodeSet[this.props.node.id] !== undefined) {
      isActive = 'active'
    }

    return (
      <button
        type="button"
        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive}`}
        onClick={this.props.isClickable ? this.selectItem.bind(this) : null}
        onContextMenu={this.openContextMenu}
      >
        {this.props.node.label}
        <span className="badge badge-primary badge-pill">
          {this.props.node.meta.isStd ? 'standard' : ''}
        </span>
        <span className="badge badge-secondary badge-pill">
          {this.props.node.meta.isExternal ? 'external' : ''}
        </span>
      </button>
    )
  }

  private selectItem() {
    const selectionSet: ISetGraph = { nodeSet: {}, edgeSet: {} }
    selectionSet.nodeSet[this.props.node.id] = this.props.node

    const initialEdgeSet: IElementSet<IEdge> = {}
    selectionSet.edgeSet = Object.values(this.props.elementSet.edgeSet)
      .filter(
        edge =>
          edge.from === this.props.node.id || edge.to === this.props.node.id
      )
      .reduce((accumulator, currentEdge) => {
        accumulator[currentEdge.id] = currentEdge
        return accumulator
      }, initialEdgeSet)

    this.props.selectElement(selectionSet)
  }

  private getMenuTemplate(node: INode, handleChange: (node: INode) => any) {
    if (this.props.isClickable) {
      return [
        {
          label: 'Hide',
          click() {
            handleChange(node)
          }
        }
      ]
    } else {
      return [
        {
          label: 'View',
          click() {
            handleChange(node)
          }
        }
      ]
    }
  }

  private openContextMenu(e: any) {
    const menu = remote.Menu.buildFromTemplate(
      this.getMenuTemplate(this.props.node, this.props.changeSingleNodeVisible)
    )

    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }
}

function mapStateToProps(state: IRootState) {
  return {
    elementSet: state.graphState.elementSet
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeSingleNodeVisible: (node: INode) => {
      dispatch(graphActions.changeSingleNodeVisible(node))
    },
    selectElement: (selectionSet: ISetGraph) => {
      dispatch(graphActions.selectElement(selectionSet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)
