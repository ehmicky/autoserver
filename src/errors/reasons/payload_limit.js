'use strict';

// Extra:
//  - kind 'size|models|commands|depth'
//  - value NUM
//  - limit NUM
const PAYLOAD_LIMIT = {
  status: 'CLIENT_ERROR',
  title: 'The request payload is too big',
};

module.exports = {
  PAYLOAD_LIMIT,
};
