import React from 'react'
import { SearchResults } from './SearchResults'

export const ProfileBookmarks = () => {
  return (
    <section className="profile-bookmarks profile-sections-wrapper">
      <section className="profile-section card">
        <h4>Bookmarks</h4>
        <SearchResults results={['coherent', 'favorite']} />
      </section>
    </section>
  )
}
