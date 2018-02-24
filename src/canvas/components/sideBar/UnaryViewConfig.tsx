import * as React from 'react'

type ViewConfigItemProps = {
  header: string
  trueLabel: string
  falseLabel: string
  current: boolean
  handleChange: () => any
}

export default (props: ViewConfigItemProps) => (
  <div className='card' style={{margin: '5px'}}>
    <div className='card-body' style={{padding: '5px'}}>
      <h5 className='card-title'>{props.header}</h5>
      <div className='card-text'>
        <div className='form-check form-check-inline'>
          <input className='form-check-input' type='radio' checked={props.current} onChange={props.handleChange} />
          <label className='form-check-label'>{props.trueLabel}</label>
        </div>
        <div className='form-check form-check-inline'>
          <input className='form-check-input' type='radio' checked={!props.current} onChange={props.handleChange} />
          <label className='form-check-label'>{props.falseLabel}</label>
        </div>
      </div>
    </div>
  </div>
)