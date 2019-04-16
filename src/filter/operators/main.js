import { isObject } from '../../utils/functional/type.js'

import { _or, _and } from './or_and.js'
import { _some, _all } from './some_all.js'
import { _eq, _neq } from './eq_neq.js'
import { _lt, _gt, _lte, _gte } from './lt_gt_lte_gte.js'
import { _in, _nin } from './in_nin.js'
import { _like, _nlike } from './like_nlike.js'

const OPERATORS = {
  _or,
  _and,
  _some,
  _all,
  _eq,
  _neq,
  _lt,
  _gt,
  _lte,
  _gte,
  _in,
  _nin,
  _like,
  _nlike,
}

export const getOperator = function({ node }) {
  const hasOperator = isObject(node) && OPERATORS[node.type] !== undefined

  if (!hasOperator) {
    return
  }

  const operator = OPERATORS[node.type]
  return operator
}

// Operators that have other operators as children
export const PARENT_OPERATORS = ['_all', '_some', '_or', '_and']

// Operators that are combined with their children operators
export const DEEP_OPERATORS = ['_some', '_all']

// Operators that are parent to attributes
export const ATTR_PARENT_OPERATORS = ['_and']

// Operators that are parent to ATTR_PARENT_OPERATORS
export const ATTR_ANCESTOR_OPERATORS = ['_or']

// Can be used with values that are enums
export const ENUM_OPERATORS = ['_eq', '_neq', '_in', '_nin']

// Cannot use siblings `model.ATTR`
// This is because this would require parsing sibling value as RegExp during
// query time, which is slow and prone to fail
// For deep operators, it is sometimes quite complicated to implement in
// database adapters. E.g. MongoDB does not allow $where inside $elemMatch
export const NO_SIBLINGS_OPERATORS = ['_like', '_nlike', '_some', '_all']
