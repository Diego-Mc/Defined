import React, { useEffect, useState } from 'react'
import { useEffectUpdate } from '../hooks/useEffectUpdate'

export const SearchBar = ({ placeholder = 'Search', onChange }) => {
  const [input, setInput] = useState('')

  useEffectUpdate(() => {
    onChange && onChange(input)
  }, [input])

  // Todo: add onSubmit for the form

  return (
    <form className="search-bar">
      <span className="material-symbols-outlined icon search-icon">search</span>
      <input
        className="input"
        type="search"
        placeholder={placeholder}
        value={input}
        onChange={({ target }) => setInput(target.value)}
      />
      <span
        onClick={() => setInput('')}
        className="material-symbols-outlined icon clear-icon">
        disabled_by_default
      </span>
    </form>
  )
}
