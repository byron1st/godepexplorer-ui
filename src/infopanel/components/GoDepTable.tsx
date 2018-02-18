import * as React from 'react'

// Should be implemented specifically for godepexplorer. No way to generalize it.
export default class Table extends React.Component<{data: any[], header: string}, {}> {
  getRow (label: string, value: string | JSX.Element, index: number, key: string) {
    return (
      <div className={`row ${index % 2 !== 0 ? 'bg-light text-dark' : 'bg-dark text-white'}`} key={key}>
        <div className='col-3'>{label}</div>
        <div className='col-9'>{value}</div>
      </div>
    )
  }

  getRowKey (id: string, key: string) {
    return id + key
  }

  getNodeElements () {
    const elements: JSX.Element[] = []

    const callbackFn = (datum: any) => {
      const rows: JSX.Element[] = []
      rows.push(this.getRow('ID', datum.id, 0, this.getRowKey(datum.id, 'ID')))
      Object.keys(datum.meta).forEach((key, index) => {
        if (key === 'funcSet') {
          const funcList = Object.keys(datum.meta[key]).map(func => <li key={datum.id+func}>{func}</li>)
          rows.push(this.getRow(key, <ul>{funcList}</ul>, index + 1, this.getRowKey(datum.id, key)))
        } else {
          rows.push(this.getRow(key, datum.meta[key], index + 1, this.getRowKey(datum.id, key)))
        }
      })

      elements.push(
        <div className='card m-3' key={datum.id}>
          <div className='card-body'>
            <h3 className='card-title'>{datum.label}</h3>
            <div className='card-text container-fluid'>
              {rows}
            </div>
          </div>
        </div>
      )
    }

    this.props.data.forEach(callbackFn)
    return elements
  }

  getEdgeElements () {
    const elements: JSX.Element[] = []

    const callbackFn = (datum: any, edgeIndex: number) => {
      const rows: JSX.Element[] = []

      rows.push(this.getRow('From (Id)', datum.from, 0, this.getRowKey(datum.id, 'from')))
      rows.push(this.getRow('To (Id)', datum.to, 1, this.getRowKey(datum.id, 'to')))
      Object.keys(datum.meta).forEach((key, index) => {
        if (key === 'depAtFunc' && datum.meta[key]) {
          const funcList = Object.keys(datum.meta[key]).map(func => <li key={datum.id+func}>{func}</li>)
          rows.push(this.getRow(key, <ul>{funcList}</ul>, index, this.getRowKey(datum.id, key)))
        } else {
          rows.push(this.getRow(key, datum.meta[key], index, this.getRowKey(datum.id, key)))
        }
      })

      elements.push(
        <div className='card m-3' key={datum.id}>
          <div className='card-body'>
            <h3 className='card-title'>Edge #{edgeIndex + 1}</h3>
            <div className='card-text container-fluid'>
              {rows}
            </div>
          </div>
        </div>
      )
    }

    this.props.data.forEach(callbackFn)
    return elements
  }

  render () {
    let elements: JSX.Element[] = null
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