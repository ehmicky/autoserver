import { crawlAttrs } from '../crawl.js'
import { getThrowErr } from '../error.js'
import { getOperator } from '../operators/main.js'

import { getDeepAttr } from './attr.js'
import { getSiblingValue } from './siblings.js'
import { validators } from './validators.js'

// `attrs` must be `{ collname: { attrName:
// { type: 'string|number|integer|boolean', isArray: true|false } } }`
export const validateFilter = ({
  filter,
  attrs,
  reason = 'VALIDATION',
  prefix = '',
  skipConfigFuncs,
}) => {
  if (filter === undefined || filter === null) {
    return
  }

  const throwErr = getThrowErr.bind(undefined, { reason, prefix })

  crawlAttrs(filter, (nodes) =>
    validateAttr({ nodes, attrs, skipConfigFuncs, throwErr }),
  )
}

const validateAttr = ({ nodes, ...rest }) => {
  nodes.forEach((node) => {
    validateNode({ node, operations: nodes, ...rest })
  })
}

const validateNode = ({
  node,
  node: { type, attrName },
  operations,
  attrs,
  skipConfigFuncs,
  throwErr,
}) => {
  const operator = getOperator({ node })

  const attr = getDeepAttr({ attrs, attrName, throwErr })

  const throwErrA = throwErr.bind(undefined, attrName)

  const valueA = getSiblingValue({ node, attrs, throwErr: throwErrA })

  validateValue({
    type,
    value: valueA,
    attr,
    operator,
    operations,
    skipConfigFuncs,
    throwErr: throwErrA,
  })
}

const validateValue = ({
  type,
  value,
  attr,
  attr: { validation: attrValidate },
  operator: { validate: opValidate },
  operations,
  skipConfigFuncs,
  throwErr,
}) => {
  if (isConfigFunc({ skipConfigFuncs, value })) {
    return
  }

  if (opValidate !== undefined) {
    opValidate({ type, value, attr, throwErr })
  }

  if (attrValidate !== undefined) {
    Object.entries(attrValidate).forEach(([keyword, ruleVal]) => {
      validators[keyword]({
        type,
        value,
        ruleVal,
        validation: attrValidate,
        operations,
        throwErr,
      })
    })
  }
}

// Skip config functions
// If one wants to validate them, they need to be evaluated first
const isConfigFunc = ({ skipConfigFuncs, value }) =>
  skipConfigFuncs && typeof value === 'function'
