import * as React from 'react'
import { connect } from 'react-redux'
import { Node, Edge } from '../../../GlobalTypes'
import Table from './GoDepInfoTable'

type InfoTableProps = {
  elements: Node[] | Edge[]
  header: string
  isVisible: boolean
  changeVisibility: () => any
}

export default (props: InfoTableProps) => (
  <div>
    <h2 onClick={props.changeVisibility}>{props.header}</h2>
    <hr />
    {
      props.isVisible
      ? <Table elements={props.elements} header={props.header} />
      : null
    }
  </div>
)