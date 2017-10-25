'use strict';

const { promisify } = require('util');

// Sends response
const send = function ({
  specific: { res } = {},
  content,
  contentType,
  contentLength,
  protocolStatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setHeaders({ res, contentType, contentLength, protocolStatus });

  const sendResponse = promisify(res.end.bind(res));

  return sendResponse(content);
};

const setHeaders = function ({
  res,
  contentType,
  contentLength,
  protocolStatus,
}) {
  if (protocolStatus) {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    res.statusCode = protocolStatus;
  }

  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  res.setHeader('Content-Length', contentLength);
};

module.exports = {
  send,
};
