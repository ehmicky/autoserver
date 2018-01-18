'use strict';

const getMessage = function ({ models }) {
  const message = `${models} could not be found`;
  return { message };
};

// Extra:
//  - collection STR
//  - ids STR_ARR
const NOT_FOUND = {
  status: 'CLIENT_ERROR',
  title: 'Some database models could not be found, e.g. the ids were invalid',
  getMessage,
};

module.exports = {
  NOT_FOUND,
};
