'use strict';

const { isType } = require('../../../content_types');

const transformContent = function ({
  response,
  response: { type, content },
  mInput,
  rpcAdapter: { transformError, transformSuccess } = {},
}) {
  if (shouldTransformError({ type, transformError })) {
    return transformError({ ...mInput, response });
  }

  if (shouldTransformSuccess({ type, transformSuccess })) {
    return transformSuccess({ ...mInput, response });
  }

  return content;
};

const shouldTransformError = function ({ type, transformError }) {
  return isType(type, 'error') && transformError;
};

const shouldTransformSuccess = function ({ type, transformSuccess }) {
  return isType(type, 'model') && transformSuccess;
};

module.exports = {
  transformContent,
};
