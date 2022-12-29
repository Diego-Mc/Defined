import React from 'react'

export const TermDefSections = ({ term }) => {
  return (
    <div className="definition-sections">
      {term.definitions.map((defs) => (
        <section key={defs.type} className="definition-section">
          <h4 className="title">{defs.type}</h4>
          <ol>
            {defs.definition.map((def) => (
              <li key={def}>{def}</li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
