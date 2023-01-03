import { userService } from '../services/user.service'

export const setLoggedInUser = () => {
  return async (dispatch) => {
    try {
      const loggedInUser = await userService.getLoggedInUser()
      dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser })
    } catch (err) {
      console.log('errr', err)
    }
  }
}

export const login = (credentials) => {
  return async (dispatch) => {
    const loggedInUser = await userService.login(credentials)
    dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser })
  }
}

export const signup = (credentials) => {
  return async (dispatch) => {
    const loggedInUser = await userService.signup(credentials)
    dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser })
  }
}

export const logout = () => {
  return async (dispatch) => {
    await userService.logout()
    dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser: null })
  }
}

export const toggleBookmark = (term) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'TOGGLE_BOOKMARK', term })
      const updatedUser = await userService.toggleBookmark(term)
    } catch (err) {
      // dispatch({ type: 'TOGGLE_BOOKMARK', term })
      console.log('errr', err)
    }
  }
}

export const addToHistory = (term) => {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.addToHistory(term)
      dispatch({ type: 'ADD_TO_HISTORY', term })
    } catch (err) {
      console.log('errr', err)
    }
  }
}
