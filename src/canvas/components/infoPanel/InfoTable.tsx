import * as React from 'react'
import * as _ from 'lodash'
import { remote } from 'electron'
import { IEdge, IDepAtFunc } from '../../graph/Type'
import { IInfoPanelData, InfoPanelDataKind } from '../../reducers/Type'
import DataSet from '../../graph/DataSet'

const keyLabelMap: { [key: string]: string } = {
  // common
  id: 'ID',
  label: 'Label',
  nor: 'Normal',
  ext: 'External',
  std: 'Standard',

  // Node
  pkgDir: 'Package Directory',
  pkgName: 'Package Name',
  pkgPath: 'Package Path',
  pkgType: 'Package Type',
  sinkEdgeIDList: 'In-relation (from)',
  sourceEdgeIDList: 'Out-relation (to)',

  // Edge
  depAtFuncSet: 'Function-level',
  from: 'Source',
  to: 'Target'
}

const edgeType = ['Composition', 'Import-Relation']

interface ITableProps {
  data: IInfoPanelData
}

export default (props: ITableProps) => {
  let jsxElements: JSX.Element = null

  if (props.data.id) {
    jsxElements =
      props.data.kind === InfoPanelDataKind.NODE
        ? getNodeElements(props.data)
        : getEdgeElements(props.data)
  }

  return <div>{jsxElements}</div>
}

function getNodeElements(node: IInfoPanelData) {
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

function getEdgeElements(edge: IInfoPanelData) {
  return (
    <div className="card m-3" key={edge.id}>
      <div className="card-body">
        <h4 className="card-title">Edge</h4>
        <div className="card-text container-fluid">
          {getEdgeMetaElements(edge)}
        </div>
      </div>
    </div>
  )
}

function getEdgeMetaElements(edge: IInfoPanelData) {
  return [
    getRow(
      'from',
      getNodePkgPath(edge.sourcePkgID),
      0,
      getRowKey(edge.id, 'from')
    ),
    getRow('to', getNodePkgPath(edge.targetPkgID), 1, getRowKey(edge.id, 'to')),
    getRow(
      'depAtFuncSet',
      <ul>{getDepAtFunc(edge.depAtFuncSet, edge.id)}</ul>,
      3,
      getRowKey(edge.id, 'depAtFuncSet')
    )
  ]
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

function getDepAtFunc(
  depAtFuncSet: { [id: string]: IDepAtFunc },
  edgeID: string
) {
  const getDepAtFuncRow = (depAtFunc: IDepAtFunc) => {
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

function getRowKey(id: string, key: string) {
  return id + key
}

function getNodePkgPath(id: string) {
  return DataSet.getNode(id).meta.pkgPath
}
