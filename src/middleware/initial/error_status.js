'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { addLogInfo } = require('../../logging');

// When throwing an exception after the normal status has been set,
// we want to convert back the status to an error one.
const errorStatus = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);
    return response;
  } catch (error) {
    const errorObj = normalizeError({ error });
    const newError = getNewError({ error: errorObj });
    rethrowError(newError);
  }
};

const getNewError = function ({ error }) {
  if (error.status) { return error; }

  const newValues = { protocolStatus: undefined, status: 'SERVER_ERROR' };
  const newError = addLogInfo(error, newValues);
  const nextError = Object.assign({}, newError, newValues);
  return nextError;
};

module.exports = {
  errorStatus,
};
