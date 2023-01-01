import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/styles/main.scss'
import { Header } from './cmps/Header'
import { Home } from './views/Home'
import { Login } from './views/Login'
import { Signup } from './views/Signup'
import { Profile } from './views/Profile'
import { TermDetails } from './views/TermDetails'
import { ProfileSettings } from './cmps/ProfileSettings'

function App() {
  return (
    <Router>
      <div className="App main-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary/:term" element={<TermDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />}>
            <Route path="bookmarks" element={null} />
            <Route path="history" element={null} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
        </Routes>
        {/* footer */}
      </div>
    </Router>
  )
}

export default App
