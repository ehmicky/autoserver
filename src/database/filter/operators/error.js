'use strict';

const throwAttrValError = function ({ opName, throwErr }, message) {
  const msg = `The value of operator '${opName}' should be ${message}`;
  throwErr(msg);
};

const throwAttrTypeError = function (
  { attrName, attr: { type }, opName, throwErr },
  message,
) {
  if (type === 'dynamic') { return; }

  const msg = `The operator '${opName}' must not be used because '${attrName}' is ${message}`;
  throwErr(msg);
};

module.exports = {
  throwAttrValError,
  throwAttrTypeError,
};
