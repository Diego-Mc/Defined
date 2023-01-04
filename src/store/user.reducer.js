export const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN_USER':
      return action.loggedInUser
    case 'TOGGLE_BOOKMARK':
      //TODO: remove login from here and just use the service to get updated user from update happening in there to upate the entire state at once..
      const { bookmarks } = state
      const hasBookmark = bookmarks.some(({ id }) => id === action.term.id)
      return hasBookmark
        ? {
            ...state,
            bookmarks: bookmarks.filter(({ id }) => id !== action.term.id),
          }
        : { ...state, bookmarks: [...bookmarks, action.term] }
    case 'ADD_TO_HISTORY':
      const { history } = state
      const HISTORY_LIMIT = 20 //max 20 results in history
      let categoryHistory = history[action.category] ?? []
      categoryHistory = [
        action.term,
        ...categoryHistory.filter((term) => term !== action.term),
      ]
      categoryHistory = categoryHistory.slice(0, HISTORY_LIMIT)
      return {
        ...state,
        history: { ...history, [action.category]: categoryHistory },
      }

    default:
      return state
  }
}
