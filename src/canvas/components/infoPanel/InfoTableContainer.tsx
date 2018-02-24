import * as React from 'react'
import { connect } from 'react-redux'
import { Node, Edge } from '../../../GlobalTypes'
import Table from './GoDepInfoTable'

type InfoTableProps = {
  elementSet: {[id: string]: Node} | {[id: string]: Edge}
  header: string
  isVisible: boolean
  changeVisibility: () => any
}

export default (props: InfoTableProps) => (
  <div>
    <h3 className='text-dark' onClick={props.changeVisibility}>{props.header}</h3>
    <hr />
    {
      props.isVisible
      ? <Table elementSet={props.elementSet} header={props.header} />
      : null
    }
  </div>
)