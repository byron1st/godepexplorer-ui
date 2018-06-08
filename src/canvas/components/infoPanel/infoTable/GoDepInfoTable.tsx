import * as React from 'react'
import * as _ from 'lodash'
import { remote } from 'electron'
import * as GraphType from '../../../graph/Type'
import DataSet from '../../../graph/DataSet'

const keyLabelMap: { [key: string]: string } = {
  count: 'Count',
  depAtFuncSet: 'Function-level',
  from: 'Source(from)',
  id: 'ID',
  label: 'Label',
  pkgDir: 'Package Directory',
  pkgName: 'Package Name',
  pkgPath: 'Package Path',
  pkgType: 'Package Type',
  to: 'Sink(to)',
  type: 'Type',
  children: 'Sub-packages',
  parent: 'Parent-package',
  nor: 'Normal',
  ext: 'External',
  std: 'Standard',
  sinkEdgeIDSet: 'In-relation (from)',
  sourceEdgeIDSet: 'Out-relation (to)'
}

const edgeType = ['Composition', 'Import-Relation']

interface ITableProps {
  elementList: GraphType.INode[] | GraphType.IEdge[]
  header: string
}

export default (props: ITableProps) => {
  let jsxElements: JSX.Element[] = null

  if (props.elementList.length !== 0) {
    isEdgeList(props.elementList)
      ? (jsxElements = getEdgeElements(props.elementList))
      : (jsxElements = getNodeElements(props.elementList))
  }

  return <div>{jsxElements}</div>
}

function getNodeElements(elementList: GraphType.INode[]) {
  const getCardForNode = (node: GraphType.INode) => (
    <div className="card m-3" key={node.id}>
      <div className="card-body">
        <h4 className="card-title">{node.label}</h4>
        <h6 className="card-subtitle text-muted">{node.meta.pkgPath}</h6>
        <div className="card-text container-fluid">
          {getNodeMetaElements(node)}
        </div>
      </div>
    </div>
  )

  return _.map(elementList, getCardForNode)
}

function getEdgeElements(elementList: GraphType.IEdge[]) {
  const getCardForEdge = (edge: GraphType.IEdge, edgeIndex: number) => (
    <div className="card m-3" key={edge.id}>
      <div className="card-body">
        <h4 className="card-title">Edge #{edgeIndex + 1}</h4>
        <div className="card-text container-fluid">
          {getEdgeMetaElements(edge)}
        </div>
      </div>
    </div>
  )

  return _.map(elementList, getCardForEdge)
}

function getNodeMetaElements(node: GraphType.INode) {
  return [
    getRow('id', node.id, 0, getRowKey(node.id, 'ID')),
    getRow(
      'pkgType',
      keyLabelMap[node.meta.pkgType],
      1,
      getRowKey(node.id, 'PkgType')
    ),
    getRow('parent', node.meta.parent, 2, getRowKey(node.id, 'parent')),
    getRow(
      'children',
      <ul>{getChildrenRow(node.meta.children, node.id)}</ul>,
      3,
      getRowKey(node.id, 'children')
    ),
    getRow(
      'sourceEdgeIDSet',
      <ul>
        {getSinkSourceEdgeRow(node.meta.sourceEdgeIDSet, node.id, false)}
      </ul>,
      4,
      getRowKey(node.id, 'sourceEdgeIDSet')
    ),
    getRow(
      'sinkEdgeIDSet',
      <ul>{getSinkSourceEdgeRow(node.meta.sinkEdgeIDSet, node.id, true)}</ul>,
      5,
      getRowKey(node.id, 'sinkEdgeIDSet')
    ),
    getRow('pkgDir', node.meta.pkgDir, 6, getRowKey(node.id, 'pkgDir'))
  ]
}

function getChildrenRow(children: { [id: string]: boolean }, nodeID: string) {
  const getPkgPath = (id: string) => DataSet.getNode(id).meta.pkgPath
  const getChildRow = (pkgPath: string) => (
    <li key={nodeID + pkgPath}>{pkgPath}</li>
  )
  return _.keys(children)
    .map(getPkgPath)
    .sort()
    .map(getChildRow)
}

function getSinkSourceEdgeRow(
  edgeIDSet: { [id: string]: boolean },
  nodeID: string,
  isSinkEdge: boolean
) {
  const getEdge = (id: string) => DataSet.getEdge(id)
  const sortEdgeBySource = (prev: GraphType.IEdge, next: GraphType.IEdge) =>
    getNodePkgPath(prev.from) <= getNodePkgPath(next.from) ? -1 : 1
  const getEdgeRowKey = (sourceID: string, sinkID: string) =>
    nodeID + sourceID + sinkID
  const getSinkEdgeRow = (edge: GraphType.IEdge) => (
    <li key={getEdgeRowKey(edge.from, edge.to)}>{getNodePkgPath(edge.from)}</li>
  )
  const getSourceEdgeRow = (edge: GraphType.IEdge) => (
    <li key={getEdgeRowKey(edge.from, edge.to)}>{getNodePkgPath(edge.to)}</li>
  )

  return _.keys(edgeIDSet)
    .map(getEdge)
    .sort(sortEdgeBySource)
    .map(isSinkEdge ? getSinkEdgeRow : getSourceEdgeRow)
}

function getEdgeMetaElements(edge: GraphType.IEdge) {
  return [
    getRow('from', getNodePkgPath(edge.from), 0, getRowKey(edge.id, 'from')),
    getRow('to', getNodePkgPath(edge.to), 1, getRowKey(edge.id, 'to')),
    getRow(
      'type',
      edgeType[Number(edge.meta.type)],
      2,
      getRowKey(edge.id, 'type')
    ),
    getRow(
      'depAtFuncSet',
      <ul>{getDepAtFunc(edge.meta.depAtFuncSet, edge.id)}</ul>,
      3,
      getRowKey(edge.id, 'depAtFuncSet')
    )
  ]
}

function getDepAtFunc(
  depAtFuncSet: { [id: string]: GraphType.IDepAtFunc },
  edgeID: string
) {
  const getDepAtFuncRow = (depAtFunc: GraphType.IDepAtFunc) => {
    const openFromFile = () => {
      remote.shell.openItem(depAtFunc.from.filename)
    }

    const openToFile = () => {
      remote.shell.openItem(depAtFunc.to.filename)
    }

    return (
      <li key={edgeID + depAtFunc.id}>
        <span
          data-toggle="tooltip"
          data-placement="top"
          title={depAtFunc.from.filename}
        >
          <a href="#" onClick={openFromFile}>
            {getShortFilename(depAtFunc.from.filename)}
          </a>
        </span>
        {`::${depAtFunc.from.signature} => `}
        <span
          data-toggle="tooltip"
          data-placement="top"
          title={depAtFunc.to.filename}
        >
          <a href="#" onClick={openToFile}>
            {getShortFilename(depAtFunc.to.filename)}
          </a>
        </span>
        {`::${depAtFunc.to.signature}`}
      </li>
    )
  }

  return _.values(depAtFuncSet).map(getDepAtFuncRow)
}

function getShortFilename(filename: string) {
  const splitted = _.split(filename, '/')
  return splitted[splitted.length - 1]
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

function isEdgeList(
  elementList: GraphType.INode[] | GraphType.IEdge[]
): elementList is GraphType.IEdge[] {
  return (elementList[0] as GraphType.IEdge).from !== undefined
}

function getRowKey(id: string, key: string) {
  return id + key
}

function getNodePkgPath(id: string) {
  return DataSet.getNode(id).meta.pkgPath
}
