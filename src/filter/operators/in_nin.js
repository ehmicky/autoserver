import { throwAttrValError } from '../error.js'

import { parseAsIs, validateNotArray, validateSameType } from './common.js'

const validateInNin = ({ value, type, attr, throwErr }) => {
  validateNotArray({ type, attr, throwErr })

  if (!Array.isArray(value)) {
    throwAttrValError({ type, throwErr }, 'an array')
  }

  value.forEach((val) => {
    validateSameType({ value: val, type, attr, throwErr })
  })
}

// `{ attribute: { _in: [...] } }`
const evalIn = ({ attr, value }) => value.includes(attr)

// `{ attribute: { _nin: [...] } }`
const evalNin = ({ attr, value }) => !value.includes(attr)

export const inOperator = {
  parse: parseAsIs,
  validate: validateInNin,
  eval: evalIn,
}
export const nin = { parse: parseAsIs, validate: validateInNin, eval: evalNin }
