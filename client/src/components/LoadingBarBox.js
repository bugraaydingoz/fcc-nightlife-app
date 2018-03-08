import React from 'react'
import './BarBox.css'
import './LoadingBarBox.css'

export class LoadingBarBox extends React.Component {
  render() {
    return (
      <div>
        <div className="box no-shadow">
          <article className="media">
            <div className="media-left">
              <figure className="">
                <div className="loading-img shine"> </div>
              </figure>
            </div>
            <div className="media-content margin-left-10">
              <div className="content">
                <div className="loading-title shine"> </div>

                {this.props.addressNumber.map((a, n) => {
                  return <div key={n} className="loading-address shine" />
                })}
              </div>

              <nav id="buttons" className="level is-mobile">
                <div className="level-left">
                  <div className="loading-button-left shine" />
                </div>

                <div className="level-right">
                  <a className="level-item">
                    <div className="loading-button-right shine" />
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>
    )
  }
}
