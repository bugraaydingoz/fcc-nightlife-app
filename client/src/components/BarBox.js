import React from 'react'
import { connect } from 'react-redux'
import './BarBox.css'

class BarBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usersGoing: props.bar.usersGoing,
      iconClassName: ' has-text-dark '
    }
  }

  componentWillMount() {
    fetch(
      'http://ba-nightlife-app.herokuapp.com/api/bars/' +
        this.props.bar.businessId +
        '/users/'
    )
      .then(result => result.json())
      .then(json => {
        if (json && json.length) {
          this.setState({ usersGoing: json })

          if (
            this.props.isAuthenticated &&
            this.state.usersGoing.find(o => o === this.props.user.id)
          ) {
            this.setState({ iconClassName: ' has-text-success ' })
          } else {
            this.setState({ iconClassName: ' has-text-dark ' })
          }
        }
      })
      .catch(e => e)
  }

  componentWillReceiveProps(nextProps) {
    // if user has just logged out, change color of button
    if (
      this.props.isAuthenticated &&
      !nextProps.isAuthenticated &&
      this.state.iconClassName === ' has-text-success '
    ) {
      this.setState({
        iconClassName: ' has-text-dark '
      })
    }
    // if user has just logged in
    if (
      !this.props.isAuthenticated &&
      nextProps.isAuthenticated &&
      this.state.iconClassName === ' has-text-dark ' &&
      this.state.usersGoing.find(o => o === nextProps.user.id)
    ) {
      this.setState({
        iconClassName: ' has-text-success '
      })
    }
  }

  handleOnClick() {
    if (this.props.isAuthenticated) {
      fetch('http://ba-nightlife-app.herokuapp.com/api/bars/mark', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.props.user.id,
          businessId: this.props.bar.businessId
        })
      })
        .then(response => response.json())
        .then(json => {
          this.setState({ usersGoing: json.usersGoing })

          if (this.state.usersGoing.find(o => o === this.props.user.id)) {
            this.setState({ iconClassName: ' has-text-success ' })
          } else {
            this.setState({ iconClassName: ' has-text-dark ' })
          }
        })
        .catch(e => e)
    }
  }

  render() {
    return (
      <div>
        <div className="box no-shadow">
          <article className="media">
            <div className="media-left">
              <figure className="">
                <img
                  className="fixed-size-image"
                  src={this.props.bar.imageUrl}
                  alt=""
                />
              </figure>
            </div>
            <div className="media-content margin-left-10">
              <div className="content">
                <p>
                  <a href={this.props.bar.url} target="_blank">
                    <strong className="title-link">
                      {this.props.bar.title}
                    </strong>
                  </a>

                  <br />
                  {this.props.bar.displayAddress
                    ? this.props.bar.displayAddress.map((a, n) => {
                        return (
                          <span key={n}>
                            {a}
                            <br />
                          </span>
                        )
                      })
                    : 'No address information given.'}
                </p>
              </div>

              <nav id="buttons" className="level is-mobile">
                <div className="level-left">
                  <div className="tags has-addons">
                    <span className="tag is-dark">GOING</span>
                    <span className="tag is-success">
                      {this.state.usersGoing.length}
                    </span>
                  </div>
                </div>

                <div className="level-right">
                  <a
                    className="level-item"
                    onClick={this.handleOnClick.bind(this)}
                  >
                    <span
                      className={'icon is-small' + this.state.iconClassName}
                    >
                      <i className="fas fa-beer" />
                    </span>
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

function mapStateToProps(state) {
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token
  }
}

export default connect(mapStateToProps)(BarBox)
