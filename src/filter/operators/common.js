import { mapValues } from '../../utils/functional/map.js'
import { throwAttrValError, throwAttrTypeError } from '../error.js'

export const parseAsIs = ({ value }) => value

export const validateSameType = ({
  type,
  value,
  attr,
  attr: { type: attrType, isArray },
  throwErr,
}) => {
  const valid = isValid({ value, attr })

  if (valid) {
    return
  }

  const message = isArray
    ? `an array of type '${attrType}'`
    : `of type ${attrType}`
  throwAttrValError({ type, throwErr }, message)
}

const isValid = ({ value, attr: { type: attrType, isArray } }) => {
  if (value === undefined) {
    return true
  }

  const typeValidatorsA = typeValidators[isArray ? 'many' : 'one']
  const typeValidator = typeValidatorsA[attrType]
  return typeValidator(value)
}

const oneTypeValidators = {
  string: (value) => typeof value === 'string',
  number: (value) => Number.isFinite(value),
  integer: (value) => Number.isInteger(value),
  boolean: (value) => typeof value === 'boolean',
  dynamic: () => true,
}

const getManyTypeValidators = () =>
  mapValues(
    oneTypeValidators,
    (validator) => (value) => Array.isArray(value) && value.every(validator),
  )

const typeValidators = {
  one: oneTypeValidators,
  many: getManyTypeValidators(),
}

export const validateNotArray = ({ type, attr, throwErr }) => {
  if (!attr.isArray) {
    return
  }

  throwAttrTypeError({ attr, type, throwErr }, 'an array')
}

export const validateArray = ({ type, attr, throwErr }) => {
  if (attr.isArray) {
    return
  }

  throwAttrTypeError({ attr, type, throwErr }, 'not an array')
}
