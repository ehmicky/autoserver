'use strict';

const { MODEL_TYPES, ERROR_TYPES } = require('../../../constants');

const transformContent = function ({
  response,
  response: { type, content },
  mInput,
  rpcAdapter: { transformError, transformSuccess } = {},
}) {
  if (ERROR_TYPES.includes(type) && transformError) {
    return transformError({ ...mInput, response });
  }

  if (MODEL_TYPES.includes(type) && transformSuccess) {
    return transformSuccess({ ...mInput, response });
  }

  return content;
};

module.exports = {
  transformContent,
};
