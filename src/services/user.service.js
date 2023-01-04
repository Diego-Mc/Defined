import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
  login,
  signup,
  logout,
  update,
  remove,
  getLoggedInUser,
  toggleBookmark,
  addToHistory,
  //al of these are update: (we can work against the store)
  // toggleBookmark, //would get the curr selected term and push/pop to user's object in DB
  // getBookmarks, //get bookmarks of current user
  // getHistory,
  // addHistory,
  // clearHistory,
  // setUserData, ==> update
  // getUserData, ==> getLoggedInUser
}

window.userService = userService

async function toggleBookmark(term) {
  let user = await getLoggedInUser()

  const { bookmarks } = user
  const hasBookmark = bookmarks.some(({ id }) => id === term.id)
  user = hasBookmark
    ? {
        ...user,
        bookmarks: bookmarks.filter(({ id }) => id !== term.id),
      }
    : { ...user, bookmarks: [...bookmarks, term] }
  return await update(user)
}

async function addToHistory(term, category) {
  let user = await getLoggedInUser()

  const { history } = user
  const HISTORY_LIMIT = 20 //max 20 results in history
  let categoryHistory = history[category] ?? []
  categoryHistory = [term, ...categoryHistory.filter((t) => t !== term)]
  categoryHistory = categoryHistory.slice(0, HISTORY_LIMIT)

  user = { ...user, history: { ...history, [category]: categoryHistory } }
  return await update(user)
}

async function remove(userId) {
  // return storageService.remove('user', userId)
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  // await storageService.put('user', user)
  user = await httpService.put(`user/${user._id}`, user)
  return user
}

async function login(userCred) {
  // const users = await storageService.query('user')
  // const user = users.find((user) => user.username === userCred.username)
  const user = await httpService.post('auth/login', userCred)
  if (user) {
    // socketService.login(user._id)
    // return _saveLocalUser(user)
    _saveLocalUser(user)
    return user
  }
  // TODO: add else?
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  userCred.bookmarks = []
  userCred.history = {}
  // const user = await storageService.post('user', userCred)
  const user = await httpService.post('auth/signup', userCred)
  // socketService.login(user._id)
  // return _saveLocalUser(user)
  _saveLocalUser(user)
  return user
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  return await httpService.post('auth/logout')
}

function _saveLocalUser(user) {
  user = {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

async function getLoggedInUser() {
  const localUser = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
  )
  if (!localUser) return null

  const user = await httpService.get(`user/${localUser._id}`)
  return user
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
