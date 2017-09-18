'use strict';

// E.g. when a nested `args.data` is used, nested actions are created,
// but their return value should not be part of the output.
// Those actions will be present in the `actions` array, but select will
// be `undefined`
const removeNestedWrite = function ({ actions }) {
  return actions.map(removeNestedWriteAction);
};

const removeNestedWriteAction = function ({ responses, ...action }) {
  const responsesA = responses.filter(({ select }) => select);
  return { responses: responsesA, ...action };
};

module.exports = {
  removeNestedWrite,
};
