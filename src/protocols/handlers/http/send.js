'use strict';

const { promisify } = require('util');

const vary = require('vary');

const { OBJECT_TYPES } = require('../../../constants');

const { failureProtocolstatus } = require('./status');

// Sends response
const send = async function ({
  specific: { req, res } = {},
  content,
  type,
  mime,
  protocolstatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  setHeaders({ res, mime, content, type, protocolstatus });

  const sendResponse = promisify(res.end.bind(res));
  await sendResponse(content);

  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy();
};

const setHeaders = function ({
  res,
  mime,
  content,
  type,
  protocolstatus = failureProtocolstatus,
}) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  res.statusCode = protocolstatus;

  if (mime) {
    res.setHeader('Content-Type', mime);
  }

  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = Buffer.byteLength(content);
  res.setHeader('Content-Length', contentLength);

  setVary({ res, type });
};

// `Vary` HTTP header
const setVary = function ({ res, type }) {
  const objectVary = OBJECT_TYPES.includes(type) ? ['Accept'] : [];
  const allVary = [
    ...objectVary,
    'Accept-Charset',
    'Accept-Encoding',
  ];
  vary(res, allVary);
};

module.exports = {
  send,
};
