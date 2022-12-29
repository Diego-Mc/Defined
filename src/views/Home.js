import React, { useEffect, useState } from 'react'
import { DefinitionCard } from '../cmps/DefinitionCard'
import { Hero } from '../cmps/Hero'
import { SearchCard } from '../cmps/SearchCard'
import { dictionaryService } from '../services/dictionary.service'

export const Home = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState(null)

  useEffect(() => {
    ;(async () => {
      const wordOfTheDay = await dictionaryService.getById('voluminous') //TODO: change.. & use memo
      setWordOfTheDay(wordOfTheDay)
    })()
  }, [])

  return (
    <main className="home-view">
      <Hero />
      {
        /* section */
        // word-of-the-day
        // synonym lookup
      }
      <section className="home-sections">
        <DefinitionCard term={wordOfTheDay} />
        <SearchCard />
      </section>
    </main>
  )
}
