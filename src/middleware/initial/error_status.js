'use strict';

// When throwing an exception after the normal status has been set,
// we want to convert back the status to an error one.
const errorStatus = async function (nextFunc, input) {
  const { log } = input;

  try {
    const response = await nextFunc(input);
    return response;
  } catch (error) {
    // Only if the status has been set with the regular middleware,
    // not the error-catching part of the middleware
    if (error.isStatusError === true) { throw error; }

    const newValues = { protocolStatus: undefined, status: 'SERVER_ERROR' };
    log.add(newValues);
    Object.assign(error, newValues);

    throw error;
  }
};

module.exports = {
  errorStatus,
};
