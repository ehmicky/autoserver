'use strict'

const { flatten } = require('../../utils')
const { DEEP_OPERATORS } = require('../operators')

const { parseOperations } = require('./operations')

const parseAttrs = function({ attrs, throwErr }) {
  if (!attrs || attrs.constructor !== Object) {
    const message = 'There should be an object containing the filter attributes'
    throwErr(message)
  }

  const nodes = Object.entries(attrs).map(([attrName, attrVal]) =>
    parseNestedAttr({ attrName, attrVal, throwErr }),
  )
  const nodesA = flatten(nodes)
  return nodesA
}

// Prepend `attrName.`, then recurse
const parseNestedAttrs = function({ attrName, attrVal, throwErr }) {
  const nodes = Object.entries(attrVal).map(([nestedName, nestedAttrVal]) =>
    parseNestedAttr({
      attrName: `${attrName}.${nestedName}`,
      attrVal: nestedAttrVal,
      throwErr,
    }),
  )
  const nodesA = flatten(nodes)
  return nodesA
}

// `{ attribute: { child: value } }` is parsed as `{ attribute.child: value }`
const parseNestedAttr = function({ attrName, attrVal, throwErr }) {
  const nestedName = findNestedAttr({ attrVal })

  // No nested attributes
  if (nestedName === undefined) {
    return parseAttr({ attrName, attrVal, throwErr })
  }

  validateMixedOp({ nestedName, attrVal, throwErr })

  return parseNestedAttrs({ attrName, attrVal, throwErr })
}

const findNestedAttr = function({ attrVal }) {
  if (typeof attrVal !== 'object' || attrVal === null) {
    return
  }

  return Object.keys(attrVal).find(
    nestedAttrName => !nestedAttrName.startsWith('_'),
  )
}

// Cannot mix with operators,
// e.g. `{ attribute: { child: value, _eq: value } }`
const validateMixedOp = function({ nestedName, attrVal, throwErr }) {
  const mixedOp = Object.keys(attrVal).find(nestedAttrName =>
    nestedAttrName.startsWith('_'),
  )

  if (mixedOp === undefined) {
    return
  }

  const message = `Cannot use operator '${mixedOp}' alongside attribute '${nestedName}'`
  throwErr(message)
}

const parseAttr = function({ attrName, attrVal, throwErr }) {
  return parseOperations({ operations: attrVal, throwErr }).map(node =>
    addAttrName({ node, attrName }),
  )
}

const addAttrName = function({ node, node: { type, value }, attrName }) {
  if (value === undefined) {
    return { ...node, attrName }
  }

  const valueA = addDeepAttrName({ type, value, attrName })
  return { type, value: valueA, attrName }
}

const addDeepAttrName = function({ type, value, attrName }) {
  if (!DEEP_OPERATORS.includes(type)) {
    return value
  }

  return value.map(node => ({ ...node, attrName: `${attrName} ${type}` }))
}

module.exports = {
  parseAttrs,
}
