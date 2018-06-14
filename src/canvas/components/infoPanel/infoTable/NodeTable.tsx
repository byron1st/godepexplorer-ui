import * as React from 'react'
import * as _ from 'lodash'
import DataSet from '../../../graph/DataSet'
import { IInfoPanelData } from '../../../reducers/Type'
import { IEdge } from '../../../graph/Type'

interface ITableProps {
  data: IInfoPanelData
}

const keyLabelMap: { [key: string]: string } = {
  id: 'ID',
  label: 'Label',
  pkgDir: 'Package Directory',
  pkgName: 'Package Name',
  pkgPath: 'Package Path',
  pkgType: 'Package Type',
  sinkEdgeIDList: 'In-relation (from)',
  sourceEdgeIDList: 'Out-relation (to)',
  nor: 'Normal',
  ext: 'External',
  std: 'Standard'
}

export default (props: ITableProps) => {
  const node = props.data
  if (node.id) {
    return (
      <div className="card m-3" key={node.id}>
        <div className="card-body">
          <h4 className="card-title">{node.label}</h4>
          <h6 className="card-subtitle text-muted">{node.pkgPath}</h6>
          <div className="card-text container-fluid">
            {getNodeMetaElements(node)}
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

function getNodeMetaElements(node: IInfoPanelData) {
  return [
    getRow('id', node.id, 0, getRowKey(node.id, 'ID')),
    getRow(
      'pkgType',
      keyLabelMap[node.pkgType],
      1,
      getRowKey(node.id, 'PkgType')
    ),
    getRow('pkgDir', node.pkgDir, 6, getRowKey(node.id, 'pkgDir')),
    getRow(
      'sourceEdgeIDList',
      <ul>{getSinkSourceEdgeRow(node.sourceEdgeIDList, node.id, false)}</ul>,
      4,
      getRowKey(node.id, 'sourceEdgeIDList')
    ),
    getRow(
      'sinkEdgeIDList',
      <ul>{getSinkSourceEdgeRow(node.sinkEdgeIDList, node.id, true)}</ul>,
      5,
      getRowKey(node.id, 'sinkEdgeIDList')
    )
  ]
}

function getRow(key: string, value: any, index: number, reactKey: string) {
  let visibleValue = value
  if (typeof value === 'boolean') {
    visibleValue = value ? 'Yes' : 'No'
  }

  return (
    <div
      className={`row ${
        index % 2 !== 0 ? 'bg-light text-dark' : 'bg-dark text-white'
      }`}
      key={reactKey}
    >
      <div className="col-3">{keyLabelMap[key]}</div>
      <div className="col-9">{visibleValue}</div>
    </div>
  )
}

function getRowKey(id: string, key: string) {
  return id + key
}

function getSinkSourceEdgeRow(
  edgeIDList: string[],
  nodeID: string,
  isSinkEdge: boolean
) {
  const getEdge = (id: string) => DataSet.getEdge(id)
  const sortEdgeBySource = (prev: IEdge, next: IEdge) =>
    getNodePkgPath(prev.from) <= getNodePkgPath(next.from) ? -1 : 1
  const getEdgeRowKey = (sourceID: string, sinkID: string) =>
    nodeID + sourceID + sinkID
  const getSinkEdgeRow = (edge: IEdge) => (
    <li key={getEdgeRowKey(edge.from, edge.to)}>{getNodePkgPath(edge.from)}</li>
  )
  const getSourceEdgeRow = (edge: IEdge) => (
    <li key={getEdgeRowKey(edge.from, edge.to)}>{getNodePkgPath(edge.to)}</li>
  )

  return edgeIDList
    .map(getEdge)
    .sort(sortEdgeBySource)
    .map(isSinkEdge ? getSinkEdgeRow : getSourceEdgeRow)
}

function getNodePkgPath(id: string) {
  return DataSet.getNode(id).meta.pkgPath
}
