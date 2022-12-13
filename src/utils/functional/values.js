import { isObject } from './type.js'

// Returns all leaves values (i.e. not objects|arrays) as a list of
// `{ value, key [...] }` pairs
export const getValues = (value, keys = []) => {
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
