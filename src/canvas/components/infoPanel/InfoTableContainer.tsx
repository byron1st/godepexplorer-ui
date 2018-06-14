import * as React from 'react'
import * as StateType from '../../reducers/Type'
import Table from './infoTable/Loader'

interface IInfoTableProps {
  data: StateType.IInfoPanelData
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
    {props.isVisible ? <Table data={props.data} /> : null}
  </div>
)
