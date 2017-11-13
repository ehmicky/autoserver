'use strict';

const { promisify } = require('util');

// Sends response
const send = async function ({
  specific: { req, res } = {},
  content,
  mime,
  protocolstatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setHeaders({ res, mime, content, protocolstatus });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy();
};

const setHeaders = function ({ res, mime, content, protocolstatus }) {
  if (protocolstatus) {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    res.statusCode = protocolstatus;
  }

  if (mime) {
    res.setHeader('Content-Type', mime);
  }

  const contentLength = Buffer.byteLength(content);
  res.setHeader('Content-Length', contentLength);
};

module.exports = {
  send,
};
