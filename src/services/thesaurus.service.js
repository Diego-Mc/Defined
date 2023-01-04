//https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${term}?key=${process.env.REACT_APP_THESAURUS_API_KEY}

//https://random-word-api.herokuapp.com/word  => to fetch random word (word of the day)

import axios from 'axios'
import { storageService } from './async-storage.service.js'
const _flattenDeep = require('lodash/flattenDeep')

const STORAGE_KEY = 'thesaurus'

export const thesaurusService = {
  query,
}
window.cs = thesaurusService

async function query({ search }) {
  const { data } = await axios.get(
    `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${search}?key=${process.env.REACT_APP_THESAURUS_API_KEY}`
  )
  console.log('1:', data)

  let ans = ''

  if (data[0].meta) {
    ans = {
      results: [search],
      synonyms: _flattenDeep(data[0].meta.syns),
      antonyms: _flattenDeep(data[0].meta.ants),
    }
  } else {
    ans = {
      results: data,
      synonyms: null,
      antonyms: null,
    }
  }

  console.log('ans', ans)

  return Promise.resolve(ans)
}
