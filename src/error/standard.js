'use strict';

const { omitBy } = require('../utilities');
const { DEFAULT_FORMAT } = require('../formats');
const { DEFAULT_COMPRESS } = require('../compress');

const { getReason, getProps } = require('./reasons');
const { normalizeError } = require('./main');
const { addErrorHandler } = require('./handler');

// Gets normalized error information
const getStandardError = function ({ error, mInput, isLimited }) {
  if (!error) { return; }

  const errorA = normalizeError({ error });

  const errorB = fillError({ error: errorA, mInput, isLimited });

  // Do not expose undefined values
  const errorC = omitBy(errorB, val => val === undefined);

  return errorC;
};

// Order matters, as this will be kept in final output
const fillError = function ({
  error,
  mInput: {
    origin,
    path: instance,
    status = 'SERVER_ERROR',
    protocol,
    method,
    queryvars,
    headers,
    payload,
    format: { name: format = 'raw' } = DEFAULT_FORMAT,
    compress: { name: compress } = DEFAULT_COMPRESS,
    charset,
    rpc,
    summary,
    topargs: args,
    commandpath,
    collname: collection,
    command,
  } = {},
  isLimited = true,
}) {
  const type = getReason({ error });
  const { title } = getProps({ error });

  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra = {},
  } = error;

  const errorA = { type, title, description, status, instance };

  if (isLimited) {
    return { ...errorA, ...extra, details };
  }

  const payloadsize = eGetPayloadsize({ payload });

  return {
    ...errorA,
    origin,
    protocol,
    method,
    queryvars,
    headers,
    payloadsize,
    format,
    charset,
    compress,
    rpc,
    summary,
    args,
    commandpath,
    collection,
    command,
    ...extra,
    // Stack trace is not included in error responses, whether in production
    // or in development because:
    //  - it might leak user-supplied code structure (e.g. event payload
    //    handlers)
    //  - it is already present in exception thrown, console event messages and
    //    failure event payload
  };
};

// Returns payload's size
const getPayloadsize = function ({ payload }) {
  if (payload === undefined) { return; }

  const payloadA = JSON.stringify(payload);
  const payloadsize = Buffer.byteLength(payloadA);
  return payloadsize;
};

// If an error occurs during JSON stringify, just give up
const getPayloadsizeHandler = () => undefined;

const eGetPayloadsize = addErrorHandler(getPayloadsize, getPayloadsizeHandler);

module.exports = {
  getStandardError,
};
