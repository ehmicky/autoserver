'use strict';

const { promisify } = require('util');

const { failureProtocolstatus } = require('./status');

// Sends response
const send = async function ({
  specific: { req, res } = {},
  content,
  contentLength,
  mime,
  protocolstatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setHeaders({ res, mime, contentLength, protocolstatus });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy();
};

const setHeaders = function ({
  res,
  mime,
  contentLength,
  protocolstatus = failureProtocolstatus,
}) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  res.statusCode = protocolstatus;

  if (mime) {
    res.setHeader('Content-Type', mime);
  }

  res.setHeader('Content-Length', contentLength);
};

module.exports = {
  send,
};
