import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { useDictionarySearch } from '../hooks/useDictionarySearch'
import { userService } from '../services/user.service'
import { SearchBar } from './SearchBar'

export const Header = () => {
  const [register] = useDictionarySearch()

  const loggedInUser = useSelector(({ user }) => {
    return user
  })

  const navigate = useNavigate()

  return (
    <header className="main-header">
      <section onClick={() => navigate('/')} className="logo">
        <Logo />
        <h1>Defined</h1>
      </section>
      <Routes>
        <Route exact path="/" element={null} />
        <Route path="/*" element={<SearchBar {...register} />} />
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
