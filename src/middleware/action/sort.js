import { sortArray, compareArrays } from '../../utils/functional/sort.js'

const sorter = function (obj, key, pathKey) {
  const val = sortArray(obj[key], sortTwo.bind(undefined, pathKey))
  return { [key]: val }
}

const sortTwo = function (pathKey, objA, objB) {
  return compareArrays(objA[pathKey], objB[pathKey])
}

// Sort `actions` so that top-level ones are fired first
export const sortActions = (obj) => sorter(obj, 'actions', 'commandpath')

// Sort `results` so that top-level ones are processed first
export const sortResults = (obj) => sorter(obj, 'results', 'path')
