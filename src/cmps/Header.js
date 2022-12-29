import React from 'react'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { SearchBar } from './SearchBar'

export const Header = () => {
  const onChange = (searchValue) => {
    console.log('searchValue', searchValue)
  }

  return (
    <header className="main-header">
      <section className="logo">
        <Logo />
        <h1>Defined</h1>
      </section>
      <SearchBar placeholder="Search a term here" onChange={onChange} />
      <section className="user">
        <span className="material-symbols-outlined">account_circle</span>
      </section>
    </header>
  )
}
