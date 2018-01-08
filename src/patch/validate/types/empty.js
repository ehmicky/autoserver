'use strict';

// Since we do not check for `empty` against `patchOp.argument` before
// model.ATTR resolution, we do it now
const checkEmpty = function ({ opVal, operator: { argument }, type }) {
  if (argument === undefined) { return; }

  if (hasWrongNull({ opVal, argument })) {
    return `the argument is invalid. Patch operator '${type}' argument must be not be empty`;
  }

  if (hasWrongNulls({ opVal, argument })) {
    return `the argument is invalid. Patch operator '${type}' argument must be not contain empty items`;
  }
};

const hasWrongNull = function ({ opVal, argument }) {
  return opVal == null && !argument.includes('empty');
};

const hasWrongNulls = function ({ opVal, argument }) {
  return Array.isArray(opVal) &&
    opVal.includes(null) &&
    !argument.includes('empty[]');
};

module.exports = {
  checkEmpty,
};
