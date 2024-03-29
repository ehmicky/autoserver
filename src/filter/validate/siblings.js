import { DEEP_OPERATORS } from '../operators/main.js'
import { isSiblingValue, validateForbiddenOpts } from '../siblings.js'

import { getAttr } from './attr.js'

// When using `model.ATTR` to target a sibling attribute
// Replace sibling attribute's value by a dummy value, since it is not known
// yet, but we still want to validate for example that sibling attribute is of
// the right attribute
export const getSiblingValue = ({
  node,
  node: { value, type },
  attrs,
  throwErr,
}) => {
  const isSibling = hasSiblingValue({ node })

  if (!isSibling) {
    return value
  }

  validateForbiddenOpts({ type, throwErr })

  const { value: attrName } = value

  // In `model.authorize`, model is under `model`.
  // In `args.filter`, it is top-level
  const attrNameA = attrs.model === undefined ? attrName : `model.${attrName}`

  // This also validates that sibling attribute exists
  const attr = getAttr({ attrs, attrName: attrNameA, throwErr })

  const valueA = getDummyValue({ attr })
  return valueA
}

const hasSiblingValue = ({ node: { type, value } }) => {
  if (DEEP_OPERATORS.has(type) && Array.isArray(value)) {
    return value.some((nodeA) => hasSiblingValue({ node: nodeA }))
  }

  return isSiblingValue({ value })
}

const getDummyValue = ({ attr: { type, isArray } }) => {
  const valueA = DUMMY_VALUES[type]
  const valueB = isArray ? [valueA] : valueA
  return valueB
}

const DUMMY_VALUES = {
  string: '',
  number: 0,
  integer: 0,
  boolean: true,
  dynamic: '',
}
