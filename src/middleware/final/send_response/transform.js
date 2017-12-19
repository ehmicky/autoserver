'use strict';

const { isType } = require('../../../content_types');

const transformContent = function ({
  response,
  response: { type, content },
  mInput,
  rpcAdapter: { transformError, transformSuccess } = {},
}) {
  if (isType(type, 'error') && transformError) {
    return transformError({ ...mInput, response });
  }

  if (isType(type, 'model') && transformSuccess) {
    return transformSuccess({ ...mInput, response });
  }

  return content;
};

module.exports = {
  transformContent,
};
