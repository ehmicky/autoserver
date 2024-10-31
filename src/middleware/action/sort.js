import { compareArrays, sortArray } from '../../utils/functional/sort.js'

const sorter = (obj, key, pathKey) => {
  const val = sortArray(obj[key], sortTwo.bind(undefined, pathKey))
  return { [key]: val }
}

const sortTwo = (pathKey, objA, objB) =>
  compareArrays(objA[pathKey], objB[pathKey])

// Sort `actions` so that top-level ones are fired first
export const sortActions = (obj) => sorter(obj, 'actions', 'commandpath')

// Sort `results` so that top-level ones are processed first
export const sortResults = (obj) => sorter(obj, 'results', 'path')
