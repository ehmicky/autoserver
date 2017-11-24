'use strict';

// Since we do not check for `null` against `patchOp.argument` before
// $model.ATTR resolution, we do it now
const checkNull = function ({ opVal, argument, type }) {
  const hasWrongNull = opVal == null && !argument.includes('null');

  if (hasWrongNull) {
    return `the argument is invalid. Patch operator '${type}' argument must be not be empty`;
  }

  const hasWrongNulls = Array.isArray(opVal) &&
    opVal.includes(null) &&
    !argument.includes('null[]');

  if (hasWrongNulls) {
    return `the argument is invalid. Patch operator '${type}' argument must be not contain empty items`;
  }
};

module.exports = {
  checkNull,
};
