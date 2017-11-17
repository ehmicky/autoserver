'use strict';

const { promisify } = require('util');

const vary = require('vary');

const { OBJECT_TYPES } = require('../../../constants');

const { setStatusCode } = require('./status');

// Sends response
const send = async function ({
  specific: { req, res },
  content,
  response: {
    data = {},
    metadata = {},
  } = {},
  type,
  mime,
  reason,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setStatusCode({ res, reason });

  setHeaders({ res, mime, content, type, data, metadata });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  cleanup({ req, res });
};

// Set HTTP-specific headers and status code
const setHeaders = function ({
  res,
  mime,
  content,
  type,
  data,
  metadata: { responsetime },
}) {
  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = Buffer.byteLength(content);

  const allow = getAllow({ data });

  const headers = {
    'Content-Type': mime,
    'Content-Length': contentLength,
    Allow: allow,
    'X-Response-Time': responsetime,
  };
  setAllHeaders(res, headers);

  setVary({ res, type });
};

// On WRONG_METHOD or WRONG_COMMAND errors
const getAllow = function ({ data: { allowedMethods, allowedCommands } }) {
  const allow = allowedMethods || allowedCommands;
  if (allow === undefined) { return; }

  return allow.join(', ');
};

const setAllHeaders = function (res, headers) {
  Object.entries(headers)
    .filter(([, value]) => value !== undefined)
    .forEach(([name, value]) => res.setHeader(name, value));
};

// `Vary` HTTP header
const setVary = function ({ res, type }) {
  const objectVary = OBJECT_TYPES.includes(type) ? ['Accept'] : [];
  const allVary = [
    ...objectVary,
    'Accept-Charset',
    'Accept-Encoding',
    'X-HTTP-Method-Override',
    'X-Apiengine-Params',
  ];
  vary(res, allVary);
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
