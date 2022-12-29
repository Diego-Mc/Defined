import React from 'react'
import { SearchBar } from './SearchBar'

const SearchResult = (props) => (
  <article className="result">
    <span class="material-symbols-outlined">search</span>
    <p>{props.text}</p>
  </article>
)

export const SearchCard = () => {
  return (
    <article className="card search-card">
      <div className="term-info">
        <SearchBar />
      </div>

      <div className="results">
        <SearchResult text="ordered" />
        <SearchResult text="coherent" />
      </div>
    </article>
  )
}
