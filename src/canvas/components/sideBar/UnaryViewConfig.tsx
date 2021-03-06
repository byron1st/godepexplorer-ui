import * as React from 'react'

interface IViewConfigItemProps {
  header: string
  current: boolean
  toggle: () => any
}

export default (props: IViewConfigItemProps) => (
  // @ts-ignore
  // "WebkitUserSelect"이 string 타입을 가질 수 없다고 ts-error를 발생시킴.
  // 하지만 가질 수 있음.
  <div className="card" style={style.card}>
    <div className="card-body" style={style.cardBody}>
      <div className="card-text">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column justify-content-center">
            <div>{props.header}</div>
          </div>
          <div>
            <div
              className={`btn btn-sm ${
                props.current ? 'btn-secondary' : 'btn-primary'
              }`}
              onClick={props.toggle}
            >
              {props.current ? 'Ignore' : 'Show'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const style = {
  card: { marginBottom: 5, WebkitUserSelect: 'none' },
  cardBody: { padding: 5 }
}
