import initialState from './initialState'

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return action.user
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: {},
        token: ''
      }
    default:
      return state
  }
}
