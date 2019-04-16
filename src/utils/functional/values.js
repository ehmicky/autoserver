import { isObject } from './type.js'

// Returns all leaves values (i.e. not objects|arrays) as a list of
// `{ value, key [...] }` pairs
const getValues = function(value, keys = []) {
  if (Array.isArray(value)) {
    return value.flatMap((valueA, key) => getValues(valueA, [...keys, key]))
  }

  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, valueA]) =>
      getValues(valueA, [...keys, key]),
    )
  }

  return [{ value, keys }]
}

module.exports = {
  getValues,
}
