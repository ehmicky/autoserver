import { isObject } from '../../utils/functional/type.js'
import { DEEP_OPERATORS } from '../operators/main.js'

import { parseOperations } from './operations.js'

export const parseAttrs = ({ attrs, throwErr }) => {
  if (!isObject(attrs)) {
    const message = 'There should be an object containing the filter attributes'
    throwErr(message)
  }

  return Object.entries(attrs).flatMap(([attrName, attrVal]) =>
    parseNestedAttr({ attrName, attrVal, throwErr }),
  )
}

// Prepend `attrName.`, then recurse
const parseNestedAttrs = ({ attrName, attrVal, throwErr }) =>
  Object.entries(attrVal).flatMap(([nestedName, nestedAttrVal]) =>
    parseNestedAttr({
      attrName: `${attrName}.${nestedName}`,
      attrVal: nestedAttrVal,
      throwErr,
    }),
  )

// `{ attribute: { child: value } }` is parsed as `{ attribute.child: value }`
const parseNestedAttr = ({ attrName, attrVal, throwErr }) => {
  const nestedName = findNestedAttr({ attrVal })

  // No nested attributes
  if (nestedName === undefined) {
    return parseAttr({ attrName, attrVal, throwErr })
  }

  validateMixedOp({ nestedName, attrVal, throwErr })

  return parseNestedAttrs({ attrName, attrVal, throwErr })
}

const findNestedAttr = ({ attrVal }) => {
  if (typeof attrVal !== 'object' || attrVal === null) {
    return
  }

  return Object.keys(attrVal).find(
    (nestedAttrName) => !nestedAttrName.startsWith('_'),
  )
}

// Cannot mix with operators,
// e.g. `{ attribute: { child: value, _eq: value } }`
const validateMixedOp = ({ nestedName, attrVal, throwErr }) => {
  const mixedOp = Object.keys(attrVal).find((nestedAttrName) =>
    nestedAttrName.startsWith('_'),
  )

  if (mixedOp === undefined) {
    return
  }

  const message = `Cannot use operator '${mixedOp}' alongside attribute '${nestedName}'`
  throwErr(message)
}

const parseAttr = ({ attrName, attrVal, throwErr }) =>
  parseOperations(parseAttrs, {
    operations: attrVal,
    throwErr,
  }).map((node) => addAttrName({ node, attrName }))

const addAttrName = ({ node, node: { type, value }, attrName }) => {
  if (value === undefined) {
    return { ...node, attrName }
  }

  const valueA = addDeepAttrName({ type, value, attrName })
  return { type, value: valueA, attrName }
}

const addDeepAttrName = ({ type, value, attrName }) => {
  if (!DEEP_OPERATORS.has(type)) {
    return value
  }

  return value.map((node) => ({ ...node, attrName: `${attrName} ${type}` }))
}
