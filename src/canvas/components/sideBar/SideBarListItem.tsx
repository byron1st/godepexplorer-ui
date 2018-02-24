import * as React from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import { Node, Edge, ElementSet, SetGraph } from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { RootState } from '../../Reducers'

type SideBarListItemProps = {
  node: Node
  selectedNodeSet: ElementSet<Node>
  elementSet: SetGraph
  isClickable: boolean
  selectElement: (selectionSet: SetGraph) => any
  changeSingleNodeVisible: (node: Node) => any
}

class SideBarListItem extends React.Component<SideBarListItemProps> {
  selectItem () {
    let selectionSet: SetGraph = { nodeSet: {}, edgeSet: {} }
    selectionSet.nodeSet[this.props.node.id] = this.props.node

    let initialEdgeSet: ElementSet<Edge> = {}
    selectionSet.edgeSet = Object.values(this.props.elementSet.edgeSet)
    .filter(edge => edge.from === this.props.node.id || edge.to === this.props.node.id)
    .reduce((accumulator, currentEdge) => {
      accumulator[currentEdge.id] = currentEdge
      return accumulator
    }, initialEdgeSet)

    this.props.selectElement(selectionSet)
  }

  getMenuTemplate (node: Node, handleChange: (node: Node) => any) {
    if (this.props.isClickable) {
      return [{ label: 'Hide', click () { handleChange(node) }}]
    } else {
      return [{ label: 'View', click () { handleChange(node) }}]
    }
  }

  openContextMenu (e: any) {
    const menu = remote.Menu.buildFromTemplate(this.getMenuTemplate(this.props.node, this.props.changeSingleNodeVisible))

    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }

  render () {
    let isActive = ''
    if (this.props.selectedNodeSet[this.props.node.id] !== undefined) {
      isActive = 'active'
    }

    return (
      <button
        type='button'
        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive}`}
        onClick={this.props.isClickable ? this.selectItem.bind(this) : null}
        onContextMenu={this.openContextMenu.bind(this)}
      >
        {this.props.node.label}
        <span className='badge badge-primary badge-pill'>{this.props.node.meta.isStd ? 'standard' : ''}</span>
        <span className='badge badge-secondary badge-pill'>{this.props.node.meta.isExternal ? 'external' : ''}</span>
      </button>
    )
  }
}

function mapStateToProps (state: RootState) {
  return {
    elementSet: state.graphState.elementSet
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    selectElement: (selectionSet: SetGraph) => {
      dispatch(graphActions.selectElement(selectionSet))
    },
    changeSingleNodeVisible: (node: Node) => {
      dispatch(graphActions.changeSingleNodeVisible(node))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)