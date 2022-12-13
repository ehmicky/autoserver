import underscoreString from 'underscore.string'

import { throwError } from '../errors/main.js'

export const getThrowErr = ({ reason, prefix }, attrName, message) => {
  const messageA = getMessage({ attrName, message })
  const messageB = underscoreString.capitalize(`${prefix}${messageA}`)
  throwError(messageB, { reason })
}

const getMessage = ({ attrName, message }) => {
  if (message === undefined) {
    return underscoreString.decapitalize(attrName)
  }

  return `in '${attrName}' attribute, ${underscoreString.decapitalize(message)}`
}

export const throwAttrValError = ({ type, throwErr }, message) => {
  const msg = `The value of operator '${type}' should be ${message}`
  throwErr(msg)
}

export const throwAttrTypeError = (
  { attr: { type: attrType }, type, throwErr },
  message,
) => {
  if (attrType === 'dynamic') {
    return
  }

  const msg = `The operator '${type}' must not be used because the attribute is ${message}`
  throwErr(msg)
}
