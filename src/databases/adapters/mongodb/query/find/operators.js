import { isObject } from '../../../../../utils/functional/type.js'

import { getSiblingNode } from './siblings.js'

// Transform `args.filter` into MongoDB query object
// Applied recursively
export const getQueryFilter = ({ type, value, attrName }) => {
  // No filter
  if (type === undefined) {
    return {}
  }

  return operators[type]({ type, value, attrName })
}

const orOperator = ({ value }) => {
  const nodes = value.map(getQueryFilter)
  return { $or: nodes }
}

const andOperator = ({ value }) => {
  const nodes = value.map(getQueryFilter)
  return { $and: nodes }
}

const someOperator = ({ value, attrName }) => {
  const elemMatch = value.map((node) =>
    getGenericNode({ ...node, key: 'opName' }),
  )
  const elemMatchA = Object.assign({}, ...elemMatch)
  return { [attrName]: { $elemMatch: elemMatchA } }
}

const allOperator = ({ value, attrName }) => {
  const elemMatch = value.map((node) =>
    getGenericNode({ ...node, key: 'inverse' }),
  )
  const elemMatchA = Object.assign({}, ...elemMatch)
  return { [attrName]: { $not: { $elemMatch: elemMatchA } } }
}

const genericOperator = ({ type, value, attrName }) => {
  const isSibling = isObject(value) && value.type === 'sibling'

  if (isSibling) {
    return getSiblingNode({ type, value, attrName })
  }

  const valueA = getGenericNode({ type, value, key: 'opName' })
  return { [attrName]: valueA }
}

const getGenericNode = ({ type, value, key }) => {
  const { [key]: name, kind } = OPERATORS_MAP[type]
  const valueA = kind === 'regexp' ? new RegExp(value, 'iu') : value
  return { [name]: valueA }
}

/* eslint-disable unicorn/no-unused-properties */
const OPERATORS_MAP = {
  _eq: { opName: '$eq', inverse: '$ne' },
  _neq: { opName: '$ne', inverse: '$eq' },
  _gt: { opName: '$gt', inverse: '$lte' },
  _gte: { opName: '$gte', inverse: '$lt' },
  _lt: { opName: '$lt', inverse: '$gte' },
  _lte: { opName: '$lte', inverse: '$gt' },
  _in: { opName: '$in', inverse: '$nin' },
  _nin: { opName: '$nin', inverse: '$in' },
  _like: { opName: '$regex', inverse: '$not', kind: 'regexp' },
  _nlike: { opName: '$not', inverse: '$regex', kind: 'regexp' },
}
/* eslint-enable unicorn/no-unused-properties */

const operators = {
  _or: orOperator,
  _and: andOperator,
  _some: someOperator,
  _all: allOperator,
  _eq: genericOperator,
  _neq: genericOperator,
  _gt: genericOperator,
  _gte: genericOperator,
  _lt: genericOperator,
  _lte: genericOperator,
  _in: genericOperator,
  _nin: genericOperator,
  _like: genericOperator,
  _nlike: genericOperator,
}
