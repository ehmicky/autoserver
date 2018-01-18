'use strict';

// Extra:
//  - kind 'parse|compress|charset|format'
//  - suggestions VAL_ARR
const PAYLOAD_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The request payload could not be loaded, parsed or content negotiation failed',
};

module.exports = {
  PAYLOAD_NEGOTIATION,
};
