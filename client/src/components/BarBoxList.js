import React from 'react'
import BarBox from './BarBox'

export class BarBoxList extends React.Component {
  render() {
    return (
      <div>
        <div className="columns is-multiline">
          {this.props.bars.map(b => {
            return (
              <div
                key={b.businessId}
                className="column is-full-mobile is-half-tablet is-one-third-desktop"
              >
                <BarBox bar={b} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
