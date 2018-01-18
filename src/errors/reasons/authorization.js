'use strict';

const getMessage = function ({ top: { command: { participle } }, models }) {
  const message = `${models} cannot be ${participle}`;
  return { message };
};

// Extra:
//  - collection STR
//  - ids STR_ARR
const AUTHORIZATION = {
  status: 'CLIENT_ERROR',
  title: 'The request is not authorized, i.e. not allowed to be performed',
  getMessage,
};

module.exports = {
  AUTHORIZATION,
};
