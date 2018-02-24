import * as React from 'react'
import { Node, Edge, ElementSetType } from '../../../GlobalTypes'

const keyLabelMap:{[key: string]: string} = {
  id: 'ID',
  label: 'Label',
  packagePath: 'Package Path',
  packageName: 'Package Name',
  packageDir: 'Package Dir',
  isPkg: 'Package?',
  isExternal: 'External Pkg?',
  isStd: 'Standard Pkg?',
  funcSet: 'Functions',
  from: 'From(ID)',
  to: 'To(ID)',
  type: 'Type',
  count: 'Count',
  depAtFunc: 'Function-level'
}

const edgeType = ['Composition', 'Import-Relation']

type TableProps = {
  elementSet: ElementSetType<Node> | ElementSetType<Edge>
  header: string
}

export default (props: TableProps) => {
  let jsxElements: JSX.Element[] = null

  if (Object.keys(props.elementSet).length !== 0) {
    isEdgeList(props.elementSet)
    ? jsxElements = getEdgeElements(props.elementSet)
    : jsxElements = getNodeElements(props.elementSet)
  }

  return (
    <div>{jsxElements}</div>
  )
}

const style = {
  tdKey: {
    fontWeight: 'bold'
  },
  tdValue: {
    fontFamily: 'monospace'
  }
}

function getNodeElements (elementSet: ElementSetType<Node>) {
  const jsxElements: JSX.Element[] = []

  Object.values(elementSet).forEach(node => {
    jsxElements.push(
      <div className='card m-3' key={node.id}>
        <div className='card-body'>
          <h3 className='card-title'>{node.label}</h3>
          <div className='card-text container-fluid'>
            {getNodeMetaElements(node)}
          </div>
        </div>
      </div>
    )
  })

  return jsxElements
}

function getEdgeElements (elementSet: ElementSetType<Edge>) {
  const jsxElements: JSX.Element[] = []

  Object.values(elementSet).forEach((edge, edgeIndex) => {
    jsxElements.push(
      <div className='card m-3' key={edge.id}>
        <div className='card-body'>
          <h3 className='card-title'>Edge #{edgeIndex + 1}</h3>
          <div className='card-text container-fluid'>
            {getEdgeMetaElements(edge)}
          </div>
        </div>
      </div>
    )
  })

  return jsxElements
}

function getNodeMetaElements (node: Node) {
  console.log(node)
  const rows: JSX.Element[] = []

  rows.push(getRow('id', node.id, 0, getRowKey(node.id, 'ID')))

  Object.keys(node.meta).forEach((key, index) => {
    if (key === 'funcSet') {
      const funcList = Object.keys(node.meta[key]).map(func => <li key={node.id+func}>{func}</li>)
      rows.push(getRow(key, <ul>{funcList}</ul>, index + 1, getRowKey(node.id, key)))
    } else {
      rows.push(getRow(key, node.meta[key], index + 1, getRowKey(node.id, key)))
    }
  })

  return rows
}

function getEdgeMetaElements (edge: Edge) {
  const rows: JSX.Element[] = []

  rows.push(getRow('from', edge.from, 0, getRowKey(edge.id, 'from')))
  rows.push(getRow('to', edge.to, 1, getRowKey(edge.id, 'to')))

  Object.keys(edge.meta).forEach((key, index) => {
    if (key === 'depAtFuncSet' && edge.meta[key]) {
      const funcList = Object.keys(edge.meta[key]).map((funcID: any) => <li key={edge.id + funcID}>{funcID}</li>)
      rows.push(getRow(key, <ul>{funcList}</ul>, index, getRowKey(edge.id, key)))
    } else if (key === 'type') {
      const value = edgeType[Number(edge.meta[key])]
      rows.push(getRow(key, value, index, getRowKey(edge.id, key)))
    } else {
      rows.push(getRow(key, edge.meta[key], index, getRowKey(edge.id, key)))
    }
  })

  return rows
}

function getRow (key: string, value: any, index: number, reactKey: string) {
  let visibleValue = value
  if (typeof value === 'boolean') {
    if (value) {
      visibleValue = 'Yes'
    } else {
      visibleValue = 'No'
    }
  }

  return (
    <div className={`row ${index % 2 !== 0 ? 'bg-light text-dark' : 'bg-dark text-white'}`} key={reactKey}>
      <div className='col-3'>{keyLabelMap[key]}</div>
      <div className='col-9'>{visibleValue}</div>
    </div>
  )
}

function isEdgeList (elementSet: ElementSetType<Node> | ElementSetType<Edge>): elementSet is ElementSetType<Edge> {
  return (Object.values(elementSet)[0] as Edge).from !== undefined
}

function getRowKey (id: string, key: string) {
  return id + key
}