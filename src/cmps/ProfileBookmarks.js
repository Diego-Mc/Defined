import React from 'react'
import { useSelector } from 'react-redux'
import { SearchResults } from './SearchResults'

export const ProfileBookmarks = () => {
  const bookmarks = useSelector(({ user }) => user?.bookmarks)
  console.log(
    'book',
    bookmarks?.map(({ id }) => id)
  )
  return (
    <section className="profile-bookmarks profile-sections-wrapper">
      <section className="profile-section card">
        <h4>Bookmarks</h4>
        <SearchResults results={bookmarks?.map(({ id }) => id)} />
      </section>
    </section>
  )
}
