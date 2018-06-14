import * as _ from 'lodash'
import { DataAction, DataActionTypeKey } from '../actions'
import DataSet from '../graph/DataSet'
import { IInfoPanelData, InfoPanelDataKind } from './Type'

const INITIAL_STATE: IInfoPanelData = {
  id: '',
  label: '',
  kind: InfoPanelDataKind.NODE
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.SHOW_INFO:
      if (DataSet.getNode(action.payload)) {
        const selectedNode = DataSet.getNode(action.payload)
        return {
          id: selectedNode.id,
          label: selectedNode.label,
          kind: InfoPanelDataKind.NODE,
          pkgType: selectedNode.type,
          pkgPath: selectedNode.meta.pkgPath,
          pkgDir: selectedNode.meta.pkgDir,
          sinkEdgeIDList: _.keys(selectedNode.meta.sinkEdgeIDSet),
          sourceEdgeIDList: _.keys(selectedNode.meta.sourceEdgeIDSet)
        }
      } else {
        const selectedEdge = DataSet.getEdge(action.payload)
        return {
          id: selectedEdge.id,
          label: `Edge: ${selectedEdge.id}`,
          kind: InfoPanelDataKind.EDGE,
          sourcePkgID: selectedEdge.from,
          targetPkgID: selectedEdge.to,
          depAtFuncSet: selectedEdge.meta.depAtFuncSet
        }
      }

    default:
      return state
  }
}
