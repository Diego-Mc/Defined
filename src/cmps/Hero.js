import { React, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { useDictionarySearch } from '../hooks/useDictionarySearch'
import { dictionaryService } from '../services/dictionary.service'
import { SearchBar } from './SearchBar'

export const Hero = () => {
  const [register] = useDictionarySearch()

  return (
    <section className="main-hero">
      <Logo />
      <p>The free dictionary</p>
      <SearchBar {...register} />
    </section>
  )
}
