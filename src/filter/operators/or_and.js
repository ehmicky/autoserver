const parseOr = ({ value, parseOperations, throwErr }) =>
  value.flatMap((_and) => parseOperations({ operations: { _and }, throwErr }))

const parseAnd = ({ value, parseAttrs, throwErr }) =>
  parseAttrs({ attrs: value, throwErr })

const optimizeOr = (node) => {
  const { value } = node

  // If some alternatives is already true, whole node is true
  const hasTrue = value.some((val) => val === undefined || val === null)

  if (hasTrue) {
    return
  }

  // When using an empty array
  if (value.length === 0) {
    return
  }

  // No need for 'or' if there is only one filter
  if (value.length === 1) {
    return value[0]
  }

  return node
}

const optimizeAnd = (node) => {
  const { value } = node

  // Remove alternatives that are already true
  const valueA = value.filter((val) => val !== undefined && val !== null)

  // When using an empty object
  if (valueA.length === 0) {
    return
  }

  // No need for 'and' if there is only one filter
  if (valueA.length === 1) {
    return valueA[0]
  }

  return { ...node, value: valueA }
}

const evalOrAnd = (operator, { attrs, value, partialNames, evalFilter }) => {
  const operatorMap = andOrMap[operator]

  const valueA = value.map((filter) =>
    evalFilter({ attrs, filter, partialNames }),
  )

  const hasSomeFalse = valueA.includes(operatorMap.some)

  if (hasSomeFalse) {
    return operatorMap.some
  }

  const valueB = valueA.filter((val) => typeof val !== 'boolean')
  const hasPartialNodes = valueB.length !== 0

  if (hasPartialNodes) {
    return simplifyNode({ type: operator, value: valueB })
  }

  return operatorMap.every
}

// Try to simplify a node when possible
const simplifyNode = (node) => {
  if (node.value.length === 1) {
    return node.value[0]
  }

  return node
}

const andOrMap = {
  _and: { some: false, every: true },
  _or: { some: true, every: false },
}

// Top-level array
const evalOr = evalOrAnd.bind(undefined, '_or')

// Several fields inside a filter object
const evalAnd = evalOrAnd.bind(undefined, '_and')

export const or = { parse: parseOr, optimize: optimizeOr, eval: evalOr }
export const and = { parse: parseAnd, optimize: optimizeAnd, eval: evalAnd }
