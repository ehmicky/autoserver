import { validateArray } from './common.js'
import { and } from './or_and.js'

const parseSomeAll = ({ value, parseOperations }) =>
  parseOperations({ operations: value })

const optimizeSomeAll = (node) => {
  // When using an empty array
  if (node.value.length === 0) {
    return
  }

  return node
}

// `{ array_attribute: { _some: { ...} } }`
const evalSome = ({ attr, value, partialNames, evalFilter }) =>
  Object.keys(attr).some((index) =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }),
  )

// `{ array_attribute: { _all: { ...} } }`
const evalAll = ({ attr, value, partialNames, evalFilter }) =>
  Object.keys(attr).every((index) =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }),
  )

const arrayMatcher = ({ attr, index, value, partialNames, evalFilter }) => {
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
