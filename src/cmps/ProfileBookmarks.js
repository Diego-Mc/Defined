import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SearchResults } from './SearchResults'

export const ProfileBookmarks = () => {
  const bookmarks = useSelector(({ user }) => user?.bookmarks)

  const navigate = useNavigate()

  const handleResultSelect = (res) => {
    navigate(`/dictionary/${res}`)
  }

  return (
    <section className="profile-bookmarks profile-sections-wrapper">
      <section className="profile-section card">
        <h4>Bookmarks</h4>
        <SearchResults
          results={bookmarks?.map(({ id }) => id)}
          onResultSelect={handleResultSelect}
        />
      </section>
    </section>
  )
}
