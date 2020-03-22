import { validateArray } from './common.js'
import { and } from './or_and.js'

const parseSomeAll = function ({ value, parseOperations }) {
  return parseOperations({ operations: value })
}

const optimizeSomeAll = function (node) {
  // When using an empty array
  if (node.value.length === 0) {
    return
  }

  return node
}

// `{ array_attribute: { _some: { ...} } }`
const evalSome = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).some((index) =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }),
  )
}

// `{ array_attribute: { _all: { ...} } }`
const evalAll = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).every((index) =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }),
  )
}

const arrayMatcher = function ({
  attr,
  index,
  value,
  partialNames,
  evalFilter,
}) {
  const valueA = value.map((val) => ({ ...val, attrName: index }))
  return and.eval({ attrs: attr, value: valueA, partialNames, evalFilter })
}

export const some = {
  parse: parseSomeAll,
  optimize: optimizeSomeAll,
  validate: validateArray,
  eval: evalSome,
}
export const all = {
  parse: parseSomeAll,
  optimize: optimizeSomeAll,
  validate: validateArray,
  eval: evalAll,
}
