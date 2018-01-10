'use strict';

const { isType } = require('../content_types');

// Transform a response according to rpc syntax
// Differs depending on whether the response is an error or a success
const transformResponse = function (
  { transformError, transformSuccess },
  { response, response: { type, content }, mInput },
) {
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
  transformResponse,
};
