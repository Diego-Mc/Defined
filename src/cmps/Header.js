import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { SearchBar } from './SearchBar'

export const Header = () => {
  const onChange = (searchValue) => {
    console.log('searchValue', searchValue)
  }

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

      <section onClick={() => navigate('/profile')} className="user">
        <span className="material-symbols-outlined">account_circle</span>
      </section>
    </header>
  )
}
