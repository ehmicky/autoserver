'use strict';

// Set a type-specific empty response when the content is not set,
// or when `args.silent` is used (unless this is an error response).
const setEmptyResponse = function ({
  content,
  topArgs: { silent = true } = {},
  error,
  emptyResponse,
}) {
  return content === undefined || (silent && !error)
    ? emptyResponse
    : content;
};

module.exports = {
  setEmptyResponse,
};
