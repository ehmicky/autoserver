'use strict';

const { isObject } = require('../../../utilities');

const { normalizePartialProtocol } = require('./partial');

// Normalize parameters created during protocol layer
const protocolNormalization = function ({
  protocolAdapter,
  topargs,
  queryvars,
  headers,
  method,
  path,
  payload,
}) {
  const {
    headers: headersA,
    method: methodA,
    path: pathA,
    payload: payloadA,
    queryvars: queryvarsA,
  } = normalizePartialProtocol({
    protocolAdapter,
    queryvars,
    headers,
    method,
    path,
    payload,
  });

  const {
    headers: headersB,
    topargs: topargsA,
  } = normalizeProtocol({ headers: headersA, topargs });

  return {
    payload: payloadA,
    headers: headersB,
    method: methodA,
    path: pathA,
    queryvars: queryvarsA,
    topargs: topargsA,
  };
};

// Normalization for any protocol, even non-partial ones
const normalizeProtocol = function ({ headers, topargs }) {
  const headersA = isObject(headers) ? headers : {};

  const topargsA = getTopargs({ topargs, headers: headersA });

  return { headers: headersA, topargs: topargsA };
};

// Client-specific parameters can be specified in protocol headers
const getTopargs = function ({ topargs = {}, headers: { params } }) {
  if (params === undefined) { return topargs; }

  return { ...topargs, params };
};

module.exports = {
  protocolNormalization,
};
