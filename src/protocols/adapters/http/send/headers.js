'use strict';

const vary = require('vary');

const { isType } = require('../../../../content_types');
const { getNames, DEFAULT_ALGO } = require('../../../../compress');

const { getLinks } = require('./link');

// Set HTTP-specific headers and status code
const setHeaders = function ({
  specific,
  specific: { res },
  contentType,
  compressResponse,
  content,
  type,
  rpc,
  response: {
    data = {},
    metadata: { duration, pages } = {},
  } = {},
}) {
  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = content.byteLength;

  const acceptEncoding = getNames();
  const contentEncoding = getContentEncoding({ compressResponse });

  const allow = getAllow({ data });

  const links = getLinks({ pages, specific, rpc });

  const headers = {
    'Content-Type': contentType,
    'Content-Length': contentLength,
    'Accept-Encoding': acceptEncoding,
    'Content-Encoding': contentEncoding,
    Allow: allow,
    Link: links,
    'X-Response-Time': duration,
  };
  setAllHeaders(res, headers);

  setVary({ res, type });
};

const getContentEncoding = function ({ compressResponse }) {
  // Means no compression was applied
  if (compressResponse === DEFAULT_ALGO) { return; }

  return compressResponse;
};

// On WRONG_METHOD or WRONG_COMMAND errors
const getAllow = function ({ data: { allowed } }) {
  if (allowed === undefined) { return; }

  return allowed.join(', ');
};

const setAllHeaders = function (res, headers) {
  Object.entries(headers)
    .filter(([, value]) => value !== undefined)
    .forEach(([name, value]) => res.setHeader(name, value));
};

// `Vary` HTTP header
const setVary = function ({ res, type }) {
  const objectVary = isType(type, 'object') ? OBJECT_VARY_HEADERS : [];
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
