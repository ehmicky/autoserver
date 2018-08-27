'use strict';

// Extra:
//  - kind 'size|models|commands|depth'
//  - value NUM
//  - limit NUM
const PAYLOAD_LIMIT = {
  status: 'CLIENT_ERROR',
  title: 'The request or response payload is too large',
};

module.exports = {
  PAYLOAD_LIMIT,
};
