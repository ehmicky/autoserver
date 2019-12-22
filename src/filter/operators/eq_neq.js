import { isDeepStrictEqual } from 'util'

import { validateSameType, parseAsIs } from './common.js'

// `{ attribute: { _eq: value } }` or `{ attribute: value }`
const evalEq = function({ attr, value }) {
  return isDeepStrictEqual(attr, value)
}

// `{ attribute: { _neq: value } }`
const evalNeq = function({ attr, value }) {
  return !isDeepStrictEqual(attr, value)
}

export const eq = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalEq,
}
export const neq = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalNeq,
}
