import { isEqual } from '../../utils/functional/equal.js'

import { validateSameType, parseAsIs } from './common.js'

// `{ attribute: { _eq: value } }` or `{ attribute: value }`
const evalEq = function({ attr, value }) {
  return isEqual(attr, value)
}

// `{ attribute: { _neq: value } }`
const evalNeq = function({ attr, value }) {
  return !isEqual(attr, value)
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
