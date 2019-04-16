import { includes } from './includes.js'

// Like Lodash difference()
export const difference = function(arrA, arrB) {
  return arrA.filter(val => !includes(arrB, val))
}
