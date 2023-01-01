import React from 'react'
import { SearchResults } from './SearchResults'

export const ProfileHistory = () => {
  return (
    <section className="profile-history profile-sections-wrapper">
      <section className="card profile-section">
        <h4>Search</h4>
        <SearchResults results={['coherent', 'history']} />
      </section>
      <section className="card profile-section">
        <h4>Synonym Finder</h4>
        <SearchResults results={['coherent', 'synonym']} />
      </section>
    </section>
  )
}
