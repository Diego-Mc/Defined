import React from 'react'
import { TermDefSections } from './TermDefSections'
import { TermHeader } from './TermHeader'

export const DefinitionCard = ({ term }) => {
  console.log('term hey', term)
  console.log(process.env)
  if (!term) return <div>Loading term...</div>
  return (
    <article className="card definition-card">
      <TermHeader term={term} />
      <TermDefSections term={term} />
    </article>
  )
}
