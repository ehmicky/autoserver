'use strict';

const { promisify } = require('util');

// Sends response
const send = async function ({
  specific: { req, res } = {},
  content,
  contentType,
  contentLength,
  protocolstatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setHeaders({ res, contentType, contentLength, protocolstatus });

  const sendResponse = promisify(res.end.bind(res));

  await sendResponse(content);

  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy();
};

const setHeaders = function ({
  res,
  contentType,
  contentLength,
  protocolstatus,
}) {
  if (protocolstatus) {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    res.statusCode = protocolstatus;
  }

  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  res.setHeader('Content-Length', contentLength);
};

module.exports = {
  send,
};
