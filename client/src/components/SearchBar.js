import React from 'react'
import './SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            term: ''
        }
    }

    render() {
        return (
            <div className='columns is-centered space-bottom'>
                <div className='column is-half'>
                    <div className='control search-bar'>
                        <input
                            type='text'
                            name='city'
                            className='input no-shadow'
                            placeholder='Where are you?'
                            onChange={event => this.onInputChange(event.target.value)} />
                    </div>
                </div>
            </div>
        )
    }

    onInputChange(term) {
        this.setState({ term })
        this.props.onSearchTermChange(term)
    }
}