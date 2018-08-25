'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');

const getMessage = function ({ kind, value }) {
  const kindName = KINDS[kind];
  const kindNameA = pluralize(kindName, value.length);

  const values = getWordsList(value, { op: 'and', quotes: true });

  return `Unsupported ${kindNameA} for the response: ${values}`;
};

const KINDS = {
  compress: 'compression algorithm',
  charset: 'charset',
  format: 'format',
};

// Extra:
//  - kind 'compress|charset|format'
//  - value STR_ARR
//  - suggestions STR_ARR
const RESPONSE_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The response content negotiation failed',
  getMessage,
};

module.exports = {
  RESPONSE_NEGOTIATION,
};
