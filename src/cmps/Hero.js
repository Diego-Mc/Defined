import React from 'react'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { SearchBar } from './SearchBar'

export const Hero = () => {
  const onChange = (searchValue) => {
    console.log('searchValue', searchValue)
  }
  return (
    <section className="main-hero">
      <Logo />
      <p>The free dictionary</p>
      <SearchBar placeholder="Search a term here" onChange={onChange} />
    </section>
  )
}
