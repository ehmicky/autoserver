import { uniq } from '../../../utils/functional/uniq.js'
import { cannotCheckType, getOpValRef } from '../../ref_parsing.js'

import { TYPES } from './available.js'
import { validateTypes } from './validate.js'

// Uses `patchOp.attribute`
export const checkAttrType = ({
  type,
  attr: { type: attrType, isArray: attrIsArray },
  operator: { attribute: possTypes },
}) => {
  if (possTypes === undefined) {
    return
  }

  const attrTypes = [attrType]
  const validTypes = validateTypes({ attrTypes, attrIsArray, possTypes })

  if (validTypes === undefined) {
    return
  }

  return `this attribute's type is invalid. Patch operator '${type}' can only be used on an attribute that is ${validTypes}`
}

// Uses `patchOp.argument`
export const checkOpValType = ({
  type,
  opVal,
  coll,
  operator: { argument },
}) => {
  if (argument === undefined) {
    return
  }

  const attrOrMessage = getOpValType({ opVal, coll, argument })

  if (attrOrMessage === undefined) {
    return
  }

  if (typeof attrOrMessage === 'string') {
    return attrOrMessage
  }

  const message = validateOpValType({ type, opVal, argument, attrOrMessage })
  return message
}

const validateOpValType = ({
  type,
  opVal,
  argument,
  attrOrMessage: { attrTypes, attrIsArray },
}) => {
  const validTypes = validateTypes({
    attrTypes,
    attrIsArray,
    possTypes: argument,
    strict: true,
  })

  if (validTypes === undefined) {
    return
  }

  const opValStr = JSON.stringify(opVal)
  return `the argument's type of ${opValStr} is invalid. Patch operator '${type}' argument must be ${validTypes}`
}

const getOpValType = ({ opVal, coll, argument }) => {
  const cannotCheck = cannotCheckType({ opVal, argument })

  if (cannotCheck) {
    return
  }

  const attrOrMessage = getOpValRef({ opVal, coll })

  if (attrOrMessage !== undefined) {
    return attrOrMessage
  }

  const attrIsArray = Array.isArray(opVal)
  const attrTypes = getAttrTypes({ attrIsArray, opVal })

  return { attrIsArray, attrTypes }
}

const getAttrTypes = ({ attrIsArray, opVal }) => {
  if (!attrIsArray) {
    const attrType = parseOpValType(opVal)
    return [attrType]
  }

  // Passing an empty array as operator argument, i.e. we do not know which
  // type it is
  if (opVal.length === 0) {
    return ['none']
  }

  // We do not allow mixed array, so we can just check the first element
  const attrTypes = parseOpValTypes(opVal)
  return attrTypes
}

const parseOpValTypes = (opVal) => {
  const attrTypes = opVal.map(parseOpValType)
  return uniq(attrTypes)
}

const parseOpValType = (value) => {
  const [attrType] = Object.entries(TYPES).find(([, { test: testFunc }]) =>
    testFunc(value),
  )
  return attrType
}
