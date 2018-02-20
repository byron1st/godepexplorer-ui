import * as React from 'react'

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

// Should be implemented specifically for godepexplorer. No way to generalize it.
export default class Table extends React.Component<{data: any[], header: string}, {}> {
  getRow (key: string, value: string | JSX.Element | boolean, index: number, reactKey: string) {
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

  getRowKey (id: string, key: string) {
    return id + key
  }

  getNodeElements () {
    const elements: JSX.Element[] = []

    const callbackFn = (datum: any) => {
      const rows: JSX.Element[] = []
      rows.push(this.getRow('id', datum.id, 0, this.getRowKey(datum.id, 'ID')))
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

      rows.push(this.getRow('from', datum.from, 0, this.getRowKey(datum.id, 'from')))
      rows.push(this.getRow('to', datum.to, 1, this.getRowKey(datum.id, 'to')))
      Object.keys(datum.meta).forEach((key, index) => {
        if (key === 'depAtFunc' && datum.meta[key]) {
          const funcList = Object.keys(datum.meta[key]).map(func => <li key={datum.id+func}>{func}</li>)
          rows.push(this.getRow(key, <ul>{funcList}</ul>, index, this.getRowKey(datum.id, key)))
        } else if (key === 'type') {
          const value = edgeType[Number(datum.meta[key])]
          rows.push(this.getRow(key, value, index, this.getRowKey(datum.id, key)))
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

    this.props.header === 'Nodes'
    ? elements = this.getNodeElements()
    : elements = this.getEdgeElements()

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