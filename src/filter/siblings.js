import { isObject } from '../utils/functional/type.js'

import { NO_SIBLINGS_OPERATORS } from './operators/main.js'

// Values starting with `model.` target sibling attributes
export const parseSiblingNode = ({ type, value, throwErr }) => {
  const attrName = parseSibling({ value })

  if (attrName === undefined) {
    return
  }

  validateForbiddenOpts({ type, throwErr })

  const shortAttrName = attrName.replace(/\..*/u, '')

  if (attrName === shortAttrName) {
    return { type: 'sibling', value: attrName }
  }

  const message = `Must not target children of sibling attributes: '${value}'. 'model.${shortAttrName}' should be used instead`
  throwErr(message)
}

export const validateForbiddenOpts = ({ type, throwErr }) => {
  if (!NO_SIBLINGS_OPERATORS.has(type)) {
    return
  }

  const message = `Cannot prefix the value with 'model.' when using the '${type}' operator`
  throwErr(message)
}

const parseSibling = ({ value }) => {
  const [, attrName] = SIBLING_REGEXP.exec(value) || []
  return attrName
}

// 'model.ATTR' -> 'ATTR'
const SIBLING_REGEXP = /^model\.(.+)/u

export const isSiblingValue = ({ value }) =>
  isObject(value) && value.type === 'sibling'

export const getSiblingValue = ({ value, attrs }) => {
  const isSibling = isSiblingValue({ value })

  if (!isSibling) {
    return value
  }

  const { value: attrNameA } = value

  const valueA = attrs[attrNameA]
  return valueA
}
