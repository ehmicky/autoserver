import { isDeepStrictEqual } from 'node:util'

export const includes = (arr, valA) =>
  arr.some((valB) => isDeepStrictEqual(valA, valB))
