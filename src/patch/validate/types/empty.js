'use strict';

// Since we do not check for `empty` against `patchOp.argument` before
// model.ATTR resolution, we do it now
const checkEmpty = function ({ opVal, operator: { argument }, type }) {
  if (argument === undefined) { return; }

  const hasWrongNull = opVal == null && !argument.includes('empty');

  if (hasWrongNull) {
    return `the argument is invalid. Patch operator '${type}' argument must be not be empty`;
  }

  const hasWrongNulls = Array.isArray(opVal) &&
    opVal.includes(null) &&
    !argument.includes('empty[]');

  if (hasWrongNulls) {
    return `the argument is invalid. Patch operator '${type}' argument must be not contain empty items`;
  }
};

module.exports = {
  checkEmpty,
};
