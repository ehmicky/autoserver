import { isEqual } from './equal.js'

const includes = function(arr, valA) {
  return arr.some(valB => isEqual(valA, valB))
}

module.exports = {
  includes,
}
