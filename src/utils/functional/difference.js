import { includes } from './includes.js'

// Like Lodash difference()
export const difference = (arrA, arrB) =>
  arrA.filter((val) => !includes(arrB, val))
