import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TermDefSections } from '../cmps/TermDefSections'
import { TermHeader } from '../cmps/TermHeader'
import { dictionaryService } from '../services/dictionary.service'

export const TermDetails = ({ term: _term }) => {
  const [term, setTerm] = useState(_term)

  const params = useParams()

  useEffect(() => {
    ;(async () => {
      if (_term) return
      const term = await dictionaryService.getById(params.term)
      console.log('term', term)
      setTerm(term)
    })()
  }, [])

  if (!term) return <div>Loading...</div>
  return (
    <section className="term-details">
      <TermHeader term={term} />
      <article className="card definition-card">
        <h3>Definitions</h3>
        <TermDefSections term={term} />
      </article>
    </section>
  )
}
