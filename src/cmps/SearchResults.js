import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export const SearchResults = ({
  results,
  onResultSelect,
  placeholder = 'Start Typing To Generate Results',
}) => {
  const navigate = useNavigate()
  return (
    <div className="results">
      {results ? (
        results.map((result) => (
          <article
            key={result}
            onClick={() => onResultSelect(result)}
            className="result">
            <span className="material-symbols-outlined">search</span>
            <p>{result}</p>
          </article>
        ))
      ) : (
        <span className="placeholder">
          {placeholder}
          <div className="dot-elastic"></div>
        </span>
      )}
    </div>
  )
}
