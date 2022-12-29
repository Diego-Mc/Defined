import React from 'react'
import { DefinitionCard } from '../cmps/DefinitionCard'
import { Hero } from '../cmps/Hero'
import { SearchCard } from '../cmps/SearchCard'

export const Home = () => {
  return (
    <main className="home-view">
      <Hero />
      {
        /* section */
        // word-of-the-day
        // synonym lookup
      }
      <section className="home-sections">
        <DefinitionCard />
        <SearchCard />
      </section>
    </main>
  )
}
