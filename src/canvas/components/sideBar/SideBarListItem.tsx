import * as React from 'react'
import { connect } from 'react-redux'
import { Node, Edge, ElementSet, SetGraph } from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { RootState } from '../../Reducers'

type SideBarListItemProps = {
  node: Node
  selectedNodeSet: ElementSet<Node>
  elementSet: SetGraph
  selectElement: (selectionSet: SetGraph) => any
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

  getVisibilityText (isVisible: boolean): JSX.Element {
    let text: JSX.Element
    isVisible
    ? text = <span className='badge badge-primary badge-pill'>visible</span>
    : text = <span className='badge badge-secondary badge-pill'>hide</span>
    return text
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
        onClick={this.selectItem.bind(this)}>
        {this.props.node.label}
        {this.getVisibilityText(this.props.node.isVisible)}
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)