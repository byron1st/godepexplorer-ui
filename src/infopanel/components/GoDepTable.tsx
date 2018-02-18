import * as React from 'react'

// Should be implemented specifically for godepexplorer. No way to generalize it.
export default class Table extends React.Component<{data: any[], header: string}, {}> {
  getRow (label: string, value: string, key: string) {
    return (
      <tr key={key}>
        <td>{label}</td>
        <td style={style.tdValue}>{value}</td>
      </tr>
    )
  }

  getRowKey (id: string, key: string) {
    return id + key
  }

  getNodeElements () {
    const elements: JSX.Element[] = []

    const callbackFn = (datum: any) => {
      const rows: JSX.Element[] = []
      rows.push(this.getRow('Id', datum.id, this.getRowKey(datum.id, 'id')))
      Object.keys(datum.meta).forEach((key) => {
        if (key === 'funcSet') {
          const funcList = Object.keys(datum.meta[key]).map(func => <li key={datum.id+func}>{func}</li>)
          rows.push(<tr key={this.getRowKey(datum.id, key)}>
            <td>{key}</td>
            <td style={style.tdValue}><ul>{funcList}</ul></td>
          </tr>)
        } else {
          rows.push(this.getRow(key, datum.meta[key], this.getRowKey(datum.id, key)))
        }
      })

      elements.push(
        <div key={datum.id}>
          <h4>{datum.label}</h4>
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      )
    }

    this.props.data.forEach(callbackFn)
    return elements
  }

  getEdgeElements () {
    const elements: JSX.Element[] = []

    const callbackFn = (datum: any, index: number) => {
      const rows: JSX.Element[] = []
      rows.push(this.getRow('From (Id)', datum.from, this.getRowKey(datum.id, 'from')))
      rows.push(this.getRow('To (Id)', datum.to, this.getRowKey(datum.id, 'to')))
      Object.keys(datum.meta).forEach((key) => {
        if (key === 'depAtFunc' && datum.meta[key]) {
          const funcList = Object.keys(datum.meta[key]).map(func => <li key={datum.id+func}>{func}</li>)
          rows.push(<tr key={this.getRowKey(datum.id, key)}>
            <td>{key}</td>
            <td style={style.tdValue}><ul>{funcList}</ul></td>
          </tr>)
        } else {
          rows.push(this.getRow(key, datum.meta[key], this.getRowKey(datum.id, key)))
        }
      })

      elements.push(
        <div key={datum.id}>
          <h4>Edge #{index + 1}</h4>
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      )
    }

    this.props.data.forEach(callbackFn)
    return elements
  }

  render () {
    let elements: JSX.Element[]
    if (this.props.header === 'Nodes') {
      elements = this.getNodeElements()
    } else {
      elements = this.getEdgeElements()
    }
    return elements
  }
}

const style = {
  tdKey: {
    fontWeight: 'bold'
  },
  tdValue: {
    fontFamily: 'monospace'
  }
}