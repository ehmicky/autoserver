import { getValues } from '../utils/functional/values.js'

// Recursively find all the JSON references
export const findRefs = ({ content }) =>
  getValues(content).filter(isRef).map(removeLastPath)

const isRef = ({ value, keys }) =>
  typeof value === 'string' && keys.at(-1) === '$ref'

// Remove `$ref` from keys
const removeLastPath = ({ value, keys }) => {
  const keysA = keys.slice(0, -1)
  return { value, keys: keysA }
}
