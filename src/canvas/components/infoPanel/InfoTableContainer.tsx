import * as React from 'react'
import { connect } from 'react-redux'
import { IEdge, INode } from '../../../GlobalTypes'
import Table from './GoDepInfoTable'

interface IInfoTableProps {
  elementSet: { [id: string]: INode } | { [id: string]: IEdge }
  header: string
  isVisible: boolean
  changeVisibility: () => any
}

export default (props: IInfoTableProps) => (
  <div>
    <h3 className="text-dark" onClick={props.changeVisibility}>
      {props.header}
    </h3>
    <hr />
    {props.isVisible ? (
      <Table elementSet={props.elementSet} header={props.header} />
    ) : null}
  </div>
)
