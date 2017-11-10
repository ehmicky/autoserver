'use strict';

const { is: isType } = require('type-is');
const { encodingExists, decode: decodeCharset } = require('iconv-lite');
const { parse: parseQueryString } = require('qs');
const { format } = require('bytes');

const { promiseThen } = require('../../utilities');
const {
  throwError,
  addErrorHandler,
  addGenErrorHandler,
  isError,
  rethrowError,
} = require('../../error');
const { PAYLOAD_TYPES } = require('../../constants');
const { getLimits } = require('../../limits');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({
  specific,
  protocolHandler,
  rpcHandler,
  runOpts,
}) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const payloadType = getPayloadType({ specific, protocolHandler, rpcHandler });

  const charset = getCharset({ specific, protocolHandler, payloadType });

  const { maxpayloadsize } = getLimits({ runOpts });

  const promise = eGetRawPayload({ protocolHandler, specific, maxpayloadsize });

  return promiseThen(
    promise,
    parseContent.bind(null, { payloadType, charset }),
  );
};

// Find the payload type, among the possible ones available in `PAYLOAD_TYPES`
const getPayloadType = function ({
  specific,
  protocolHandler,
  rpcHandler: { payload: rpcPayload = {} },
}) {
  const contentType = getContentType({ specific, protocolHandler });

  // Check the content-type header against hard-coded MIME types
  const payloadTypeA = PAYLOAD_TYPES.find(payloadType => payloadTypeMatches({
    payloadType,
    rpcPayload,
    contentType,
  }));
  if (payloadTypeA) { return payloadTypeA; }

  const message = `Unsupported Content-Type: '${contentType}'`;
  throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

// Use protocol-specific way to retrieve the content type header
const getContentType = function ({ specific, protocolHandler }) {
  const contentType = protocolHandler.getContentType({ specific });
  if (contentType) { return contentType; }

  const message = 'Must specify Content-Type when sending a request payload';
  throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

const payloadTypeMatches = function ({
  payloadType: { type, mime },
  rpcPayload,
  contentType,
}) {
  // Check also for rpc-specific MIME types
  const rpcTypes = rpcPayload[type] || [];
  const mimeA = [...mime, ...rpcTypes];

  return isType(contentType, mimeA);
};

// Use protocol-specific way to retrieve the payload charset
const getCharset = function ({
  specific,
  protocolHandler,
  payloadType,
  payloadType: { defaultCharset = DEFAULT_CHARSET },
}) {
  const charset = protocolHandler.getCharset({ specific }) || defaultCharset;
  const charsetA = charset.toLowerCase();

  validateCharset({ charset: charsetA, payloadType });

  return charsetA;
};

const DEFAULT_CHARSET = 'utf-8';

const validateCharset = function ({
  charset,
  payloadType: { charsets, title },
}) {
  if (!encodingExists(charset)) {
    const message = `Invalid charset: ${charset.toUpperCase()}`;
    throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
  }

  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);

  if (!typeSupportsCharset) {
    const message = `Invalid charset: ${charset.toUpperCase()} cannot be used with a ${title} content type`;
    throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
  }
};

// Use protocol-specific way to parse payload, using a known type
const getRawPayload = function ({ protocolHandler, specific, maxpayloadsize }) {
  return protocolHandler.getPayload({ specific, maxpayloadsize });
};

const getRawPayloadHandler = function (error, { maxpayloadsize }) {
  if (!isError({ error })) {
    const message = 'Could not parse request payload';
    throwError(message, { reason: 'PAYLOAD_PARSE', innererror: error });
  }

  if (error.reason === 'INPUT_LIMIT') {
    const message = `The request payload must not be larger than ${format(maxpayloadsize)}`;
    throwError(message, { reason: 'INPUT_LIMIT', innererror: error });
  }

  rethrowError(error);
};

const eGetRawPayload = addErrorHandler(getRawPayload, getRawPayloadHandler);

const parseContent = function ({ payloadType, charset }, payload) {
  const payloadA = eDecodeCharset(payload, charset);

  const payloadB = eFireParser({ payloadType, payload: payloadA });

  return { payload: payloadB };
};

// Charset decoding is done in a protocol-agnostic way
const eDecodeCharset = addGenErrorHandler(decodeCharset, {
  message: ({ charset }) => `The request payload is invalid: the charset '${charset}' could not be decoded`,
  reason: 'WRONG_CONTENT_TYPE',
});

const fireParser = function ({ payloadType: { type }, payload }) {
  return parsers[type](payload);
};

const eFireParser = addGenErrorHandler(fireParser, {
  message: ({ payloadType: { title } }) => `The request payload is not valid ${title}`,
  reason: 'WRONG_CONTENT_TYPE',
});

const urlencodedParse = function (body) {
  // TODO: not sure about this
  if (body.length === 0) { return {}; }

  // TODO: use same code as src/middleware/protocols/query_string
  return parseQueryString(body, {
    allowPrototypes: true,
    arrayLimit: 100,
    depth: Infinity,
  });
};

const jsonParse = function (body) {
  if (body.length === 0) {
    throw new Error('JSON payload cannot be empty');
  }

  let bodyA;
  try {
    bodyA = JSON.parse(body)
  } catch (e) {
    throw new Error('Invalid JSON payload');
  }

  const first = FIRST_CHAR_REGEXP.exec(body)[1];
  if (first !== '{' && first !== '[') {
    throw new Error('JSON payload must be an object or an array');
  }

  return bodyA;
};

// RegExp to match the first non-space in a string.
// Allowed whitespace is defined in RFC 7159
const FIRST_CHAR_REGEXP = /^[\x20\x09\x0a\x0d]*(.)/;

const rawParse = function (buf) {
  return buf;
};

const textParse = function (buf) {
  return buf;
};

const parsers = {
  urlencoded: urlencodedParse,
  json: jsonParse,
  raw: rawParse,
  text: textParse,
};

module.exports = {
  parsePayload,
};
