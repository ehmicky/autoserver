import { difference } from '../../utils/functional/difference.js'
import { reverseArray } from '../../utils/functional/reverse.js'
import { sortArray } from '../../utils/functional/sort.js'

export const ANY_ARRAY = [
  'boolean[]',
  'integer[]',
  'number[]',
  'string[]',
  'object[]',
  'empty[]',
]

const commonAttrs = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,
}

const commonEmptyAttrs = {
  attribute: ANY_ARRAY,

  argument: ['empty'],
}

export const push = {
  ...commonAttrs,

  apply: ({ value: attrVal = [], arg: opVal = [] }) => [...attrVal, ...opVal],
}

export const unshift = {
  ...commonAttrs,

  apply: ({ value: attrVal = [], arg: opVal = [] }) => [...opVal, ...attrVal],
}

export const pop = {
  ...commonEmptyAttrs,

  apply: ({ value: attrVal = [] }) => attrVal.slice(0, -1),
}

export const shift = {
  ...commonEmptyAttrs,

  apply: ({ value: attrVal = [] }) => attrVal.slice(1),
}

export const remove = {
  ...commonAttrs,

  apply: ({ value: attrVal = [], arg: opVal = [] }) =>
    difference(attrVal, opVal),
}

export const sort = {
  attribute: ANY_ARRAY,

  argument: ['string'],

  check: ({ arg: order }) => {
    if (ORDERS.has(order)) {
      return
    }

    return "the argument's value must be 'asc' or 'desc'"
  },

  apply: ({ value: attrVal = [], arg: order = 'asc' }) => {
    const attrValA = sortArray(attrVal)
    return order === 'asc' ? attrValA : reverseArray(attrValA)
  },
}

const ORDERS = new Set(['asc', 'desc'])
