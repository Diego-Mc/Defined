import { storageService } from './async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
  login,
  signup,
  logout,
  update,
  remove,
  getLoggedInUser,
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

function remove(userId) {
  return storageService.remove('user', userId)
  // return httpService.delete(`user/${userId}`)
}

async function update(user) {
  await storageService.put('user', user)
  // user = await httpService.put(`user/${user._id}`, user)
  return user
}

async function login(userCred) {
  const users = await storageService.query('user')
  const user = users.find((user) => user.username === userCred.username)
  // const user = await httpService.post('auth/login', userCred)
  if (user) {
    // socketService.login(user._id)
    return _saveLocalUser(user)
  }
  // TODO: add else?
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  const user = await storageService.post('user', userCred)
  // const user = await httpService.post('auth/signup', userCred)
  // socketService.login(user._id)
  return _saveLocalUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  // return await httpService.post('auth/logout')
}

function _saveLocalUser(user) {
  user = {
    _id: user._id,
    fullName: user.fullName,
    imgUrl: user.imgUrl,
    username: user.username,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
