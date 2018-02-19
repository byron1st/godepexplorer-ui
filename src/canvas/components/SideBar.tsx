import * as React from 'react'

export default class MenuBar extends React.Component {
  render () {
    return (
      <div className='position-fixed bg-light' style={{height: 'inherit', width:'300px', zIndex: 1010}}>
      </div>
    )
  }
}