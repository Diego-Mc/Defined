import { httpService } from './http.service.js'

const STORAGE_KEY = 'dictionary'

export const dictionaryService = {
  query,
  getById,
}
window.cs = dictionaryService

async function query(filterBy = { txt: '', price: 0 }) {
  return httpService.get(STORAGE_KEY, filterBy)
}

function getById(dictionaryId) {
  return httpService.get(`dictionary/${dictionaryId}`)
}
