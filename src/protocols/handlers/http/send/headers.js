'use strict';

const vary = require('vary');

const { OBJECT_TYPES } = require('../../../../constants');
const { compressHandlers } = require('../../../../compress');

// Set HTTP-specific headers and status code
const setHeaders = function ({
  res,
  mime,
  compressResponse,
  content,
  type,
  response: {
    data = {},
    metadata: { duration } = {},
  } = {},
}) {
  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = content.byteLength;

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
  const objectVary = OBJECT_TYPES.includes(type) ? OBJECT_VARY_HEADERS : [];
  vary(res, [...objectVary, ...VARY_HEADERS]);
};

const VARY_HEADERS = [
  'Accept-Encoding',
  'X-HTTP-Method-Override',
  'X-Apiengine-Params',
];

const OBJECT_VARY_HEADERS = [
  'Content-Type',
  'Accept',
];

module.exports = {
  setHeaders,
};
