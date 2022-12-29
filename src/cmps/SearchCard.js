import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'

const SearchResult = (props) => (
  <article onClick={props.onClick} className="result">
    <span className="material-symbols-outlined">search</span>
    <p>{props.text}</p>
  </article>
)

export const SearchCard = () => {
  const navigate = useNavigate()
  return (
    <article className="card search-card">
      <div className="term-info">
        <SearchBar />
      </div>

      <div className="results">
        <SearchResult
          onClick={() => navigate('dictionary/safe')}
          text="ordered"
        />
        <SearchResult text="coherent" />
      </div>
    </article>
  )
}
