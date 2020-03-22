const commonTypes = {
  attribute: ['number'],
  argument: ['number', 'empty'],
}

const commonChecks = (defaultValue) => ({
  ...commonTypes,

  check({ arg: opVal = defaultValue, type: attrType }) {
    checkInteger({ opVal, attrType })
  },
})

const checkInteger = function ({ opVal, attrType }) {
  if (attrType !== 'integer' || Number.isInteger(opVal)) {
    return
  }

  return `the argument must be an integer instead of ${opVal}`
}

export const add = {
  ...commonChecks(0),

  apply({ value: attrVal = 0, arg: opVal = 0 }) {
    return attrVal + opVal
  },
}

export const sub = {
  ...commonChecks(0),

  apply({ value: attrVal = 0, arg: opVal = 0 }) {
    return attrVal - opVal
  },
}

export const mul = {
  ...commonChecks(1),

  apply({ value: attrVal = 0, arg: opVal = 1 }) {
    return attrVal * opVal
  },
}

export const div = {
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
