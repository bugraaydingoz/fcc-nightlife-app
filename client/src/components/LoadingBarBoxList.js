import React from 'react'
import { LoadingBarBox } from './LoadingBarBox'

export class LoadingBarBoxList extends React.Component {
  render() {
    return (
      <div>
        <div className="columns is-multiline">
          {this.props.barNumber.map(b => {
            return (
              <div
                key={b}
                className="column is-full-mobile is-half-tablet is-one-third-desktop"
              >
                <LoadingBarBox addressNumber={[1, 2]} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
