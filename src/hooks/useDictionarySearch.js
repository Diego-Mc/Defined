import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { dictionaryService } from '../services/dictionary.service'
import { addToHistory } from '../store/user.actions'

export const useDictionarySearch = () => {
  const [results, setResults] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onChange = async (searchValue) => {
    console.log('searchValue', searchValue)
    const res = await dictionaryService.query({ search: searchValue })
    console.log('found:', res)
    setResults((prev) => res.map(({ id }) => id).slice(0, 4))
    console.log('new', results)
  }

  const handleResultSelect = (term) => {
    navigate(`/dictionary/${term}`)
    dispatch(addToHistory(term, 'search'))
  }

  const register = {
    onChange,
    onResultSelect: handleResultSelect,
    results,
    placeholder: 'Search a term here',
  }

  return [register, results, setResults]
}
