import { has, get } from '../utils/functional/get_set.js'

import { getOperator } from './operators/main.js'
import { getSiblingValue } from './siblings.js'

// Check if a set of `attrs` matches a filter such as `args.filter` or
// `coll.authorize`
export const evalFilter = function({
  filter,
  filter: { type, attrName, value } = {},
  attrs,
  partialNames,
}) {
  // E.g. when there is no `args.filter`
  if (type === undefined) {
    return true
  }

  if (isPartial({ partialNames, attrName })) {
    return filter
  }

  const attr = getAttr({ attrs, attrName })
  const operator = getOperator({ node: filter })
  const valueA = getSiblingValue({ value, attrs })

  // `evalFilter` is passed for recursion
  return operator.eval({
    attr,
    attrs,
    value: valueA,
    partialNames,
    evalFilter,
  })
}

// Nodes marked as partial, i.e. whose name matches the `partialNames` regexp,
// are unknown, i.e. left as is unless they can be deduced from boolean logic.
const isPartial = function({ partialNames, attrName }) {
  if (attrName === undefined || partialNames === undefined) {
    return false
  }

  return partialNames.test(attrName)
}

// Attribute names can use dot-notation for deep access
const getAttr = function({ attrs, attrName }) {
  if (attrName === undefined) {
    return
  }

  const path = attrName.split('.')

  if (!has(attrs, path)) {
    return
  }

  const attr = get(attrs, path)
  return attr
}
