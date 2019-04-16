import { throwAttrValError } from '../error.js'

import { parseAsIs, validateNotArray, validateSameType } from './common.js'

const validateInNin = function({ value, type, attr, throwErr }) {
  validateNotArray({ type, attr, throwErr })

  if (!Array.isArray(value)) {
    throwAttrValError({ type, throwErr }, 'an array')
  }

  value.forEach(val => validateSameType({ value: val, type, attr, throwErr }))
}

// `{ attribute: { _in: [...] } }`
const evalIn = function({ attr, value }) {
  return value.includes(attr)
}

// `{ attribute: { _nin: [...] } }`
const evalNin = function({ attr, value }) {
  return !value.includes(attr)
}

// eslint-disable-next-line no-underscore-dangle
const _in = { parse: parseAsIs, validate: validateInNin, eval: evalIn }
// eslint-disable-next-line no-underscore-dangle
const _nin = { parse: parseAsIs, validate: validateInNin, eval: evalNin }

module.exports = {
  _in,
  _nin,
}
