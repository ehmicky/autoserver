'use strict';


const { STATUS_CODES } = require('http');

const { httpBody } = require('../../parsing');


const sendError = function ({ error, input: { res } }) {
  res.statusCode = error.status;
  httpBody.send.json({
    res,
    // See RFC 7807
    contentType: 'application/problem+json',
    message: { error },
  });
};

const getRequestUrl = function ({ input: { req } }) {
  return req[Symbol.for('requestUrl')];
};

const createError = function ({ error, protocolError: httpError }) {
  const status = httpError.status || 500;

  // Re-specify keys to get correct order
  return {
    type: error.type,
    // HTTP status code
    status,
    // Defaults to standards message for that HTTP status code
    title: error.title || STATUS_CODES[status],
    description: error.description,
    instance: error.instance,
    details: error.details,
  };
};


module.exports = {
  sendError,
  getRequestUrl,
  createError,
};