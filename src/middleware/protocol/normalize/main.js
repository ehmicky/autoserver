'use strict';

const { normalizePartialProtocol } = require('./partial');

// Normalize variables created during protocol layer
const protocolNormalization = function ({ topargs, ...rest }) {
  const {
    headers: headersA,
    method: methodA,
    path: pathA,
    payload: payloadA,
    queryvars: queryvarsA,
  } = normalizePartialProtocol({ ...rest });

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
  const headersA = headers && headers.constructor === Object ? headers : {};

  const topargsA = getTopargs({ topargs, headers: headersA });

  return { headers: headersA, topargs: topargsA };
};

// Client-specific variables can be specified in protocol headers
const getTopargs = function ({ topargs = {}, headers: { params } }) {
  if (params === undefined) { return topargs; }

  return { ...topargs, params };
};

module.exports = {
  protocolNormalization,
};
