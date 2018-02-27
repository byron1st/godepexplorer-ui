import * as React from 'react'
import { IEdge, IElementSet, INode } from '../../../GlobalTypes'

const keyLabelMap: { [key: string]: string } = {
  count: 'Count',
  depAtFunc: 'Function-level',
  from: 'From(ID)',
  id: 'ID',
  isExternal: 'External Pkg?',
  isPkg: 'Package?',
  isStd: 'Standard Pkg?',
  label: 'Label',
  packageDir: 'Package Dir',
  packageName: 'Package Name',
  packagePath: 'Package Path',
  to: 'To(ID)',
  type: 'Type',
  children: 'Sub-packages',
  parent: 'Parent-package'
}

const edgeType = ['Composition', 'Import-Relation']

interface ITableProps {
  elementSet: IElementSet<INode> | IElementSet<IEdge>
  header: string
}

export default (props: ITableProps) => {
  let jsxElements: JSX.Element[] = null

  if (Object.keys(props.elementSet).length !== 0) {
    isEdgeList(props.elementSet)
      ? (jsxElements = getEdgeElements(props.elementSet))
      : (jsxElements = getNodeElements(props.elementSet))
  }

  return <div>{jsxElements}</div>
}

const style = {
  tdKey: {
    fontWeight: 'bold'
  },
  tdValue: {
    fontFamily: 'monospace'
  }
}

function getNodeElements(elementSet: IElementSet<INode>) {
  const jsxElements: JSX.Element[] = []

  Object.values(elementSet).forEach(node => {
    jsxElements.push(
      <div className="card m-3" key={node.id}>
        <div className="card-body">
          <h3 className="card-title">{node.label}</h3>
          <div className="card-text container-fluid">
            {getNodeMetaElements(node)}
          </div>
        </div>
      </div>
    )
  })

  return jsxElements
}

function getEdgeElements(elementSet: IElementSet<IEdge>) {
  const jsxElements: JSX.Element[] = []

  Object.values(elementSet).forEach((edge, edgeIndex) => {
    jsxElements.push(
      <div className="card m-3" key={edge.id}>
        <div className="card-body">
          <h3 className="card-title">Edge #{edgeIndex + 1}</h3>
          <div className="card-text container-fluid">
            {getEdgeMetaElements(edge)}
          </div>
        </div>
      </div>
    )
  })

  return jsxElements
}

function getNodeMetaElements(node: INode) {
  const rows: JSX.Element[] = []

  rows.push(getRow('id', node.id, 0, getRowKey(node.id, 'ID')))

  Object.keys(node.meta).forEach((key, index) => {
    if (key === 'children') {
      const children = Object.keys(node.meta[key]).map(childID => (
        <li key={node.id + childID}>{childID}</li>
      ))
      rows.push(
        getRow(key, <ul>{children}</ul>, index + 1, getRowKey(node.id, key))
      )
    } else if (key === 'sinkEdgeIDSet' || key === 'sourceEdgeIDSet') {
      // TODO: do something.
    } else {
      rows.push(getRow(key, node.meta[key], index + 1, getRowKey(node.id, key)))
    }
  })

  return rows
}

function getEdgeMetaElements(edge: IEdge) {
  const rows: JSX.Element[] = []

  rows.push(getRow('from', edge.from, 0, getRowKey(edge.id, 'from')))
  rows.push(getRow('to', edge.to, 1, getRowKey(edge.id, 'to')))

  Object.keys(edge.meta).forEach((key, index) => {
    if (key === 'depAtFuncSet' && edge.meta[key]) {
      const funcList = Object.keys(edge.meta[key]).map((funcID: any) => (
        <li key={edge.id + funcID}>{funcID}</li>
      ))
      rows.push(
        getRow(key, <ul>{funcList}</ul>, index, getRowKey(edge.id, key))
      )
    } else if (key === 'type') {
      const value = edgeType[Number(edge.meta[key])]
      rows.push(getRow(key, value, index, getRowKey(edge.id, key)))
    } else {
      rows.push(getRow(key, edge.meta[key], index, getRowKey(edge.id, key)))
    }
  })

  return rows
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
  elementSet: IElementSet<INode> | IElementSet<IEdge>
): elementSet is IElementSet<IEdge> {
  return (Object.values(elementSet)[0] as IEdge).from !== undefined
}

function getRowKey(id: string, key: string) {
  return id + key
}
