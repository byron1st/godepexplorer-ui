import * as React from 'react'
import Table from './GoDepTable'

interface InfoTableState {
  isVisible: boolean
}

interface InfoTableProps {
  data: any
  header: string
}

export class InfoTable extends React.Component<InfoTableProps, InfoTableState> {
  state = {
    isVisible: true
  }

  changeVisible () {
    this.setState({ isVisible: !this.state.isVisible })
  }

  render () {
    // const table = this.getTable()

    return <div style={style.container}>
      <h3 onClick={this.changeVisible.bind(this)}>{this.props.header}</h3>
      {
        this.state.isVisible
        // ? table
        ? <Table data={this.props.data} />
        : null
      }
    </div>
  }
}

const style = {
  container: {
    width: 'inherit'
  }
}