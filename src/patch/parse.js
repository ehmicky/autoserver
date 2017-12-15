'use strict';

const { isObject } = require('../utilities');

// Check if this is a patch operation, e.g. `{ _add: 10 }`
const isPatchOp = function (patchOp) {
  // Patch operations should have a single property, but this is not
  // validated here
  return isObject(patchOp) && Object.keys(patchOp).some(isPatchOpName);
};

// Patch operations are prefixed with _ to differentiate from nested attributes
const isPatchOpName = function (key) {
  return key.startsWith('_');
};

const parsePatchOp = function (patchOp) {
  if (!isPatchOp(patchOp)) { return {}; }

  const [[type, opVal]] = Object.entries(patchOp);
  return { type, opVal };
};

module.exports = {
  isPatchOp,
  isPatchOpName,
  parsePatchOp,
};
