import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { thesaurusService } from '../services/thesaurus.service'
import { addToHistory } from '../store/user.actions'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'

export const SearchCard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  thesaurusService.query({ search: 'celdgsdgsd' })

  const [results, setResults] = useState(null)
  const [synonyms, setSynonyms] = useState(null)

  const onChange = async (searchValue) => {
    console.log('searchValue', searchValue)
    const res = await thesaurusService.query({ search: searchValue })
    console.log('found:', res)
    setResults((prev) => res.results.slice(0, 4))
    console.log('new', results)
  }

  const handleSynonymResultSelect = (term) => {
    navigate(`/dictionary/${term}`)
    dispatch(addToHistory(term, 'search'))
  }

  const handleSearchResultSelect = async (query) => {
    setResults((prev) => [query])
    const res = await thesaurusService.query({ search: query })
    console.log('found1:', res)
    setSynonyms((prev) => res?.synonyms.slice(0, 10))
    dispatch(addToHistory(query, 'synonym'))
    //TODO: set value of search input to be query
  }

  return (
    <article className="card search-card">
      <div className="term-info">
        <SearchBar
          placeholder="Search a synonym here"
          onChange={onChange}
          results={results}
          onResultSelect={handleSearchResultSelect}
        />
      </div>
      {/* TODO: add placeholder option for searchResults as well */}
      {/* TODO: set default searchValue search to be today's word */}
      <SearchResults
        results={synonyms}
        onResultSelect={handleSynonymResultSelect}
      />
    </article>
  )
}
