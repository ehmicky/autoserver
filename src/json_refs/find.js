import { getValues } from '../utils/functional/values.js'

// Recursively find all the JSON references
export const findRefs = function({ content }) {
  return getValues(content)
    .filter(isRef)
    .map(removeLastPath)
}

const isRef = function({ value, keys }) {
  return typeof value === 'string' && keys[keys.length - 1] === '$ref'
}

// Remove `$ref` from keys
const removeLastPath = function({ value, keys }) {
  const keysA = keys.slice(0, -1)
  return { value, keys: keysA }
}
