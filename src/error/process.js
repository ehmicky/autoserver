'use strict';


const { defaultsDeep } = require('lodash');

const { getErrorReason } = require('./reasons');


// Helper for layer-related error handler middleware
// Each layer should have a error handler middleware that applies layer-specific
// information to thrown exceptions.
// This helps building this kind of middleware
//   @param keyName {string}                - layer name, e.g. 'protocol'
//   @param key {string}                    - layer value, e.g. 'http'
//   @param genericInfo {object}            - layer-specific information merged
//                                            to error.
//                                            Should not depend on `key` value
//   @param processErrorMap {function}      - add layer-specific information to
//                                            error and|or input.
//                                            Should depend on `key` value
//   @param transformResponseMap {function} - transform error response
const processError = function ({
  error,
  input,
  keyName,
  key,
  genericInfo = {},
  processErrorMap = {},
  transformResponseMap = {},
}) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  // Apply reason-specific layer-specific information
  const { [keyName]: info = {} } = getErrorReason({ error });
  const specificInfo = info[key];
  defaultsDeep(error, specificInfo);

  // Apply layer-specific information
  const processErrorFunc = processErrorMap[key];
  if (processErrorFunc) {
    processErrorFunc({ error, input });
  }

  // Apply generic layer-related information
  defaultsDeep(error, { extra: { [keyName]: key } });
  defaultsDeep(error, genericInfo);

  // Apply layer-specific response transformations
  const transformResponse = transformResponseMap[key];
  if (transformResponse) {
    error.transforms = error.transforms || [];
    error.transforms.push(transformResponse);
  }

  return error;
};


module.exports = {
  processError,
};
