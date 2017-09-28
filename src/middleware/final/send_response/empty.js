'use strict';

// Set a type-specific empty response when `args.silent` is used
// (unless this is an error response).
const setEmptyResponse = function ({
  content,
  topArgs: { silent } = {},
  error,
  emptyResponse,
}) {
  if (silent && !error) { return emptyResponse; }

  return content;
};

module.exports = {
  setEmptyResponse,
};
