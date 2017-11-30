'use strict';

const { promisify } = require('util');

const { setStatusCode } = require('./status');
const { setHeaders } = require('./headers');

// Sends response
const send = async function ({
  specific: { req, res },
  content,
  reason,
  ...rest
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setStatusCode({ res, reason });

  setHeaders({ res, content, ...rest });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  cleanup({ req, res });
};

const cleanup = function ({ req, res }) {
  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy();

  // Not sure if this needed
  req.destroy();
  res.destroy();
};

module.exports = {
  send,
};
