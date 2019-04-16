import { includes } from './includes.js'
import { uniq } from './uniq.js'

// Like Lodash intersection()
export const intersection = function(arrA, arrB, ...arrays) {
  const arrC = arrA.filter(val => includes(arrB, val))

  if (arrays.length === 0) {
    return uniq(arrC)
  }

  return intersection(arrC, ...arrays)
}
