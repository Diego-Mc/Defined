import React from 'react'

export const TermHeader = ({ term }) => {
  return (
    <div className="term-info">
      <h3 className="term-title">{term.id}</h3>
      <p className="term-syllables">
        [{term.syllables?.join('-') || term.syllables}]
      </p>
    </div>
  )
}
