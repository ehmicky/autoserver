import { isObject } from '../../utils/functional/type.js'

import { eq, neq } from './eq_neq.js'
import { inOperator, nin } from './in_nin.js'
import { like, nlike } from './like_nlike.js'
import { lt, gt, lte, gte } from './lt_gt_lte_gte.js'
import { or, and } from './or_and.js'
import { some, all } from './some_all.js'

const OPERATORS = {
  _or: or,
  _and: and,
  _some: some,
  _all: all,
  _eq: eq,
  _neq: neq,
  _lt: lt,
  _gt: gt,
  _lte: lte,
  _gte: gte,
  _in: inOperator,
  _nin: nin,
  _like: like,
  _nlike: nlike,
}

export const getOperator = function ({ node }) {
  const hasOperator = isObject(node) && OPERATORS[node.type] !== undefined

  if (!hasOperator) {
    return
  }

  const operator = OPERATORS[node.type]
  return operator
}

// Operators that have other operators as children
export const PARENT_OPERATORS = new Set(['_all', '_some', '_or', '_and'])

// Operators that are combined with their children operators
export const DEEP_OPERATORS = new Set(['_some', '_all'])

// Operators that are parent to attributes
export const ATTR_PARENT_OPERATORS = new Set(['_and'])

// Operators that are parent to ATTR_PARENT_OPERATORS
export const ATTR_ANCESTOR_OPERATORS = new Set(['_or'])

// Can be used with values that are enums
export const ENUM_OPERATORS = new Set(['_eq', '_neq', '_in', '_nin'])

// Cannot use siblings `model.ATTR`
// This is because this would require parsing sibling value as RegExp during
// query time, which is slow and prone to fail
// For deep operators, it is sometimes quite complicated to implement in
// database adapters. E.g. MongoDB does not allow $where inside $elemMatch
export const NO_SIBLINGS_OPERATORS = new Set([
  '_like',
  '_nlike',
  '_some',
  '_all',
])
