import { React, useRef, useState } from 'react'
import { ReactComponent as Logo } from '../assets/imgs/defined-logo.svg'
import { dictionaryService } from '../services/dictionary.service'
import { SearchBar } from './SearchBar'

export const Hero = () => {
  const [results, setResults] = useState(null)

  const onChange = async (searchValue) => {
    console.log('searchValue', searchValue)
    const res = await dictionaryService.query({ search: searchValue })
    console.log('found:', res)
    setResults((prev) => res.map(({ id }) => id).slice(0, 4))
    console.log('new', results)
  }

  return (
    <section className="main-hero">
      <Logo />
      <p>The free dictionary</p>
      <SearchBar
        placeholder="Search a term here"
        onChange={onChange}
        results={results}
      />
    </section>
  )
}
