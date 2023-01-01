import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'

export const SearchCard = () => {
  const navigate = useNavigate()
  return (
    <article className="card search-card">
      <div className="term-info">
        <SearchBar />
      </div>
      <SearchResults results={['ordered', 'coherent']} />
    </article>
  )
}
