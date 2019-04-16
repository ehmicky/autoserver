import { isEqual } from './equal.js'

export const includes = function(arr, valA) {
  return arr.some(valB => isEqual(valA, valB))
}
