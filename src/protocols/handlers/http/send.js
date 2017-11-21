'use strict';

const { promisify } = require('util');

const vary = require('vary');

const { OBJECT_TYPES } = require('../../../constants');
const { compressHandlers } = require('../../../compress');

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
  compressResponse,
  reason,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setStatusCode({ res, reason });

  setHeaders({ res, mime, compressResponse, content, type, data, metadata });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  cleanup({ req, res });
};

// Set HTTP-specific headers and status code
const setHeaders = function ({
  res,
  mime,
  compressResponse,
  content,
  type,
  data,
  metadata: { duration },
}) {
  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = Buffer.byteLength(content);

  const acceptEncoding = getAcceptEncoding();

  const allow = getAllow({ data });

  const headers = {
    'Content-Type': mime,
    'Content-Length': contentLength,
    'Accept-Encoding': acceptEncoding,
    'Content-Encoding': compressResponse,
    Allow: allow,
    'X-Response-Time': duration,
  };
  setAllHeaders(res, headers);

  setVary({ res, type });
};

// On WRONG_METHOD or WRONG_COMMAND errors
const getAllow = function ({ data: { allowed } }) {
  if (allowed === undefined) { return; }

  return allowed.join(', ');
};

// Possible compression algorithms
const getAcceptEncoding = function () {
  return Object.keys(compressHandlers).join(', ');
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
    'Content-Type',
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
