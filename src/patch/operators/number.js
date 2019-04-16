const commonTypes = {
  attribute: ['number'],
  argument: ['number', 'empty'],
}

const commonChecks = defaultValue => ({
  ...commonTypes,

  check({ arg: opVal = defaultValue, type: attrType }) {
    checkInteger({ opVal, attrType })
  },
})

const checkInteger = function({ opVal, attrType }) {
  if (attrType !== 'integer' || Number.isInteger(opVal)) {
    return
  }

  return `the argument must be an integer instead of ${opVal}`
}

// eslint-disable-next-line no-underscore-dangle
export const _add = {
  ...commonChecks(0),

  apply({ value: attrVal = 0, arg: opVal = 0 }) {
    return attrVal + opVal
  },
}

// eslint-disable-next-line no-underscore-dangle
export const _sub = {
  ...commonChecks(0),

  apply({ value: attrVal = 0, arg: opVal = 0 }) {
    return attrVal - opVal
  },
}

// eslint-disable-next-line no-underscore-dangle
export const _mul = {
  ...commonChecks(1),

  apply({ value: attrVal = 0, arg: opVal = 1 }) {
    return attrVal * opVal
  },
}

// eslint-disable-next-line no-underscore-dangle
export const _div = {
  ...commonTypes,

  check({ arg: opVal = 1, type: attrType }) {
    if (opVal === 0) {
      return 'the argument must not be 0'
    }

    checkInteger({ opVal, attrType })
  },

  apply({ value: attrVal = 0, arg: opVal = 1 }) {
    return attrVal / opVal
  },
}
