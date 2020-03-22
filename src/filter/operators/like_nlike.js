import { addErrorHandler } from '../../errors/handler.js'
import { throwAttrValError, throwAttrTypeError } from '../error.js'

import { validateNotArray } from './common.js'

const parseLikeNlike = function ({ value }) {
  // Using .* or .*$ at the end of a RegExp is useless
  // MongoDB documentation also warns against it as a performance optimization
  return value.replace(/\.\*$/u, '').replace(/\.\*\$$/u, '')
}

const validateLikeNlike = function ({
  value,
  type,
  attr,
  attr: { type: attrType, isArray },
  throwErr,
}) {
  validateNotArray({ type, attr, throwErr })

  if (typeof value !== 'string') {
    throwAttrValError({ type, throwErr }, 'a string')
  }

  if (attrType !== 'string') {
    throwAttrTypeError({ attr, type, throwErr }, 'not a string')
  }

  if (isArray) {
    throwAttrTypeError({ attr, type, throwErr }, 'an array')
  }

  eValidateRegExp({ value, throwErr })
}

// Validate it is correct regexp
const validateRegExp = function ({ value }) {
  // eslint-disable-next-line no-new
  new RegExp(value, 'iu')
}

const regExpParserHandler = function (exception, { value, throwErr }) {
  const message = `Invalid regular expression: '${value}'`
  throwErr(message)
}

const eValidateRegExp = addErrorHandler(validateRegExp, regExpParserHandler)

// `{ string_attribute: { _like: 'REGEXP' } }`
const evalLike = function ({ attr, value }) {
  const regExp = new RegExp(value, 'iu')
  return regExp.test(attr)
}

// `{ string_attribute: { _nlike: 'REGEXP' } }`
const evalNlike = function ({ attr, value }) {
  const regExp = new RegExp(value, 'iu')
  return !regExp.test(attr)
}

export const like = {
  parse: parseLikeNlike,
  validate: validateLikeNlike,
  eval: evalLike,
}
export const nlike = {
  parse: parseLikeNlike,
  validate: validateLikeNlike,
  eval: evalNlike,
}
