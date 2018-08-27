'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');

const getMessage = function (type, { kind, value }) {
  if (value === undefined) { return; }

  const kindName = KINDS[kind];
  const kindNameA = pluralize(kindName, value.length);

  const values = getWordsList(value, { op: 'and', quotes: true });

  return `Unsupported ${kindNameA} for the ${type}: ${values}`;
};

const KINDS = {
  type: 'type',
  compress: 'compression algorithm',
  charset: 'charset',
  format: 'format',
};

// Extra:
//  - kind 'type|compress|charset|format'
//  - value STR_ARR
//  - suggestions VAL_ARR
const REQUEST_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The request content negotiation failed',
  getMessage: getMessage.bind(null, 'request'),
};

// Extra:
//  - kind 'compress|charset|format'
//  - value STR_ARR
//  - suggestions STR_ARR
const RESPONSE_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The response content negotiation failed',
  getMessage: getMessage.bind(null, 'response'),
};

module.exports = {
  REQUEST_NEGOTIATION,
  RESPONSE_NEGOTIATION,
};
