import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/styles/main.scss'
import { Header } from './cmps/Header'
import { Home } from './views/Home'
import { TermDetails } from './views/TermDetails'

function App() {
  return (
    <Router>
      <div className="App main-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary/:term" element={<TermDetails />} />
          <Route path="/profile" element={null}>
            <Route path="bookmarks" element={null} />
            <Route path="history" element={null} />
            <Route path="settings" element={null} />
          </Route>
        </Routes>
        {/* footer */}
      </div>
    </Router>
  )
}

export default App
