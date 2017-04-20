'use strict';


const { STATUS_CODES } = require('http');

const { httpBody } = require('../../../../parsing');


const sendError = function ({ error, input: { res } }) {
  res.statusCode = error.status;
  httpBody.send.json({
    res,
    // See RFC 7807
    contentType: 'application/problem+json',
    message: { error },
  });
};

const processError = function ({ error, errorInput }) {
  const status = errorInput.status || 500;
  // Request URL, i.e. everything except query string and hash
  const instance = errorInput.req[Symbol.for('requestUrl')] || 'unknown';

  Object.assign(error, {
    // HTTP status code
    status,
    // Defaults to standards message for that HTTP status code
    title: error.title || STATUS_CODES[status],
    instance,
  });

  return error;
};


module.exports = {
  http: {
    sendError,
    processError,
  },
};
