import * as React from 'react'
import * as GraphType from '../../graph/Type'
import Table from './infoTable/Loader'

interface IInfoTableProps {
  elementList: GraphType.INode[] | GraphType.IEdge[]
  header: string
  isVisible: boolean
  isNode: boolean
  changeVisibility: () => any
}

export default (props: IInfoTableProps) => (
  <div>
    <h5 className="text-dark" onClick={props.changeVisibility}>
      {props.header}
    </h5>
    <hr />
    {props.isVisible ? (
      <Table elementList={props.elementList} header={props.header} />
    ) : null}
  </div>
)
