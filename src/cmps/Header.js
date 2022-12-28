import React from 'react'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'

export const Header = () => {
  return (
    <header className="main-header">
      <section className="logo">
        <Logo />
        <h1>Defined</h1>
      </section>
      <section className="user">
        <span className="material-symbols-outlined">account_circle</span>
      </section>
    </header>
  )
}
