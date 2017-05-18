'use strict';


const { STATUS_CODES } = require('http');

const { httpBody } = require('../../../../parsing');


const sendResponse = function ({
  response: { error, status, contentType },
  input: { protocol: { specific: { res } } },
}) {
  res.statusCode = status;
  httpBody.send.json({
    res,
    contentType,
    message: error,
  });
};

const processResponse = function ({
  response,
  errorInput: { status = 500, protocol: { requestUrl } } = {},
}) {
  // HTTP status code
  response.status = status;

  // Defaults to standards message for that HTTP status code
  const title = response.title || STATUS_CODES[status];

  // Request URL, i.e. everything except query string and hash
  const instance = requestUrl || 'unknown';

  Object.assign(response.error, { status, title, instance });

  return response;
};


module.exports = {
  http: {
    sendResponse,
    processResponse,
  },
};
