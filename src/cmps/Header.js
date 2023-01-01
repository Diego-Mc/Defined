import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { userService } from '../services/user.service'
import { SearchBar } from './SearchBar'

export const Header = () => {
  const onChange = (searchValue) => {
    console.log('searchValue', searchValue)
  }

  const loggedInUser = userService.getLoggedInUser()
  console.log('loggedInUser:', loggedInUser)

  const navigate = useNavigate()

  return (
    <header className="main-header">
      <section onClick={() => navigate('/')} className="logo">
        <Logo />
        <h1>Defined</h1>
      </section>
      <Routes>
        <Route exact path="/" element={null} />
        <Route
          path="/*"
          element={
            <SearchBar placeholder="Search a term here" onChange={onChange} />
          }
        />
      </Routes>

      {loggedInUser ? (
        <section onClick={() => navigate('/profile')} className="user card">
          {/* <span className="material-symbols-outlined icon">account_circle</span> */}
          <img
            className="icon"
            src={`https://avatars.dicebear.com/api/identicon/${loggedInUser.username}.svg`}
          />
          <p className="name">{loggedInUser.username}</p>
        </section>
      ) : (
        <section onClick={() => navigate('/signup')} className="user card">
          <span className="material-symbols-outlined icon">account_circle</span>
          <p className="name">Sign up</p>
        </section>
      )}
    </header>
  )
}
