import * as React from 'react'

export class InfoTable extends React.Component<{ data: any }, {}> {
  render () {
    const rows: any[] = []
    this.props.data.forEach((datum: any) => {
      Object.keys(datum).forEach((key) => {
        rows.push(
          <tr>
            <td>{key}</td>
            <td>{datum[key]}</td>
          </tr>
        )
      })
    })
    console.log(rows)
    return <div style={style.container}>
      <table>
        {rows}
      </table>
    </div>
  }
}

const style = {
  container: {
    height: 'inherit',
    width: 'inherit'
  }
}