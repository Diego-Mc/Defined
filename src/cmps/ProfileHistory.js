import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SearchResults } from './SearchResults'

export const ProfileHistory = () => {
  const history = useSelector(({ user }) => user?.history)

  const navigate = useNavigate()

  const handleResultSelect = (res) => {
    navigate(`/dictionary/${res}`)
  }

  console.log('gg', history)

  return (
    <section className="profile-history profile-sections-wrapper">
      <section className="card profile-section">
        <h4>Search</h4>
        <SearchResults
          results={history?.search}
          onResultSelect={handleResultSelect}
        />
      </section>
      <section className="card profile-section">
        <h4>Synonym Finder</h4>
        <SearchResults
          results={history?.synonym}
          onResultSelect={handleResultSelect}
        />
      </section>
    </section>
  )
}
