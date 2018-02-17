import * as React from 'react'

// Should be implemented specifically for godepexplorer. No way to generalize it.
export default class Table extends React.Component<{data: any[]}, {}> {
  getRow (label: string, value: string, key: string) {
    return (
      <tr key={key}>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    )
  }

  getRowKey (id: string, key: string) {
    return id + key
  }

  render () {
    const rows: JSX.Element[] = []
    const callbackFn = (datum: any) => {
      rows.push(this.getRow('id', datum.id, this.getRowKey(datum.id, 'id')))
      rows.push(this.getRow('label', datum.label, this.getRowKey(datum.id, 'label')))
      Object.keys(datum.meta).forEach((key) => {
        if (key !== 'funcSet') {
          rows.push(this.getRow(key, datum.meta[key], this.getRowKey(datum.id, key)))
        }
      })
    }

    this.props.data.forEach(callbackFn)

    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}