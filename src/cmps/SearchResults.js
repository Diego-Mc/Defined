import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export const SearchResults = ({ results }) => {
  const navigate = useNavigate()
  return (
    <div className="results">
      {results.map((result) => (
        <article
          key={result}
          onClick={() => navigate(`dictionary/${result}`)}
          className="result">
          <span className="material-symbols-outlined">search</span>
          <p>{result}</p>
        </article>
      ))}
    </div>
  )
}
