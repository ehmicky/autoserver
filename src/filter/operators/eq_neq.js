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

// eslint-disable-next-line no-underscore-dangle
export const _eq = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalEq,
}
// eslint-disable-next-line no-underscore-dangle
export const _neq = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalNeq,
}
