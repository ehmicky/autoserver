'use strict'

// Extra:
//  - limit NUM
const TIMEOUT = {
  status: 'CLIENT_ERROR',
  title: 'The request took too much time to process',
  getMessage: ({ limit }) =>
    `The request took more than ${limit /
      MILLISECS_TO_SECS} seconds to process`,
}

const MILLISECS_TO_SECS = 1e3

module.exports = {
  TIMEOUT,
}
