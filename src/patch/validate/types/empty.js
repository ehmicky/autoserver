// Since we do not check for `empty` against `patchOp.argument` before
// model.ATTR resolution, we do it now
export const checkEmpty = ({ opVal, operator: { argument }, type }) => {
  if (argument === undefined) {
    return
  }

  if (hasWrongNull({ opVal, argument })) {
    return `the argument is invalid. Patch operator '${type}' argument must be not be empty`
  }

  if (hasWrongNulls({ opVal, argument })) {
    return `the argument is invalid. Patch operator '${type}' argument must be not contain empty items`
  }
}

const hasWrongNull = ({ opVal, argument }) =>
  (opVal === undefined || opVal === null) && !argument.includes('empty')

const hasWrongNulls = ({ opVal, argument }) =>
  Array.isArray(opVal) &&
  // eslint-disable-next-line unicorn/no-null
  opVal.includes(null) &&
  !argument.includes('empty[]')
