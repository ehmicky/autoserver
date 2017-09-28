'use strict';

// E.g. when a nested `args.data` is used, nested actions are created,
// but their return value should not be part of the output.
// Those actions will be present in the `actions` array, but select will
// be `undefined`
const removeNestedWrite = function ({ responses }) {
  return responses.filter(({ select }) => select);
};

module.exports = {
  removeNestedWrite,
};
