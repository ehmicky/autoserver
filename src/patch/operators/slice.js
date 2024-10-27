import { ANY_ARRAY } from './array.js'

const checkSlice = ({ arg: opVal }) => {
  if (opVal.length <= 2) {
    return
  }

  return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)'
}

const commonAttrs = {
  argument: ['integer[]', 'empty[]'],

  check: checkSlice,
}

// Negative indexes are from the end. Null indexes are representing the end.
// Positive indexes are from the start.
const argToIndex = (arg, attrVal) => {
  if (arg === undefined || arg === null) {
    return attrVal.length
  }

  if (arg >= 0) {
    return arg
  }

  return attrVal.length + arg
}

const sliceApply = ({ attrVal, start, end }) => {
  const startA = argToIndex(start, attrVal)
  const endA = argToIndex(end, attrVal)
  return attrVal.slice(startA, endA)
}

export const slicestr = {
  ...commonAttrs,

  attribute: ['string'],

  apply: ({ value: attrVal = '', arg: [start, end] }) =>
    sliceApply({ attrVal, start, end }),
}

export const slice = {
  ...commonAttrs,

  attribute: ANY_ARRAY,

  apply: ({ value: attrVal = [], arg: [start, end] }) =>
    sliceApply({ attrVal, start, end }),
}

const insertApply = ({ index, attrVal }) => {
  const indexA = argToIndex(index, attrVal)
  const start = attrVal.slice(0, indexA)
  const end = attrVal.slice(indexA)
  return { start, end }
}

export const insertstr = {
  attribute: ['string'],

  argument: ['integer[]', 'empty[]', 'string[]'],

  check: ({ arg: opVal }) => {
    if (isValidInsertstr({ opVal })) {
      return
    }

    return 'the argument must be an array with one integer (the index) and a string'
  },

  apply: ({ value: attrVal = '', arg: [index, str] }) => {
    const { start, end } = insertApply({ index, attrVal })
    return `${start}${str}${end}`
  },
}

const isValidInsertstr = ({ opVal }) =>
  opVal.length === 2 &&
  (Number.isInteger(opVal[0]) || opVal[0] === undefined || opVal[0] === null) &&
  typeof opVal[1] === 'string'

export const insert = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  check: ({ arg: [index] }) => {
    const isValid =
      Number.isInteger(index) || index === undefined || index === null

    if (isValid) {
      return
    }

    return "the argument's first value must be an integer (the index)"
  },

  apply: ({ value: attrVal = [], arg: [index, ...values] }) => {
    const { start, end } = insertApply({ index, attrVal })
    return [...start, ...values, ...end]
  },
}
