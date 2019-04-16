const { isObject } = require('../../utils/functional/type.js')
const { getOperator } = require('../operators/main.js')
const { parseSiblingNode } = require('../siblings')

const parseOperations = function({ operations, throwErr }) {
  const operationsA = getShortcut({ operations })

  return Object.entries(operationsA).map(([type, value]) =>
    parseOperation({ type, value, throwErr }),
  )
}

// `{ attribute: value }` is a shortcut for `{ attribute: { _eq: value } }`
const getShortcut = function({ operations }) {
  if (isObject(operations)) {
    return operations
  }

  return { _eq: operations }
}

const parseOperation = function({ type, value, throwErr }) {
  const node = { type, value }
  const operator = getOperator({ node })

  if (operator === undefined) {
    const message = `Must not use unknown operator '${type}'`
    throwErr(message)
  }

  // Normalize `null|undefined` to only `undefined`
  if (value == null) {
    return { type }
  }

  const valueA = parseValue({ operator, type, value, throwErr })

  return { ...node, value: valueA }
}

const parseValue = function({ operator, type, value, throwErr }) {
  const valueA = parseSiblingNode({ type, value, throwErr })

  if (valueA !== undefined) {
    return valueA
  }

  // Pass `parseAttrs` and `parseOperations` for recursion
  const { parseAttrs } = require('./attrs')

  return operator.parse({ value, parseAttrs, parseOperations, throwErr })
}

module.exports = {
  parseOperations,
  parseOperation,
}
