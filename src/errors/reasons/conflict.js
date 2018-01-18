'use strict';

const getMessage = function ({ ids, models }) {
  const exist = ids.length === 1 ? 'exists' : 'exist';
  const message = `${models} already ${exist}`;
  return { message };
};

// Extra:
//  - collection STR
//  - ids STR_ARR
const CONFLICT = {
  status: 'CLIENT_ERROR',
  title: 'Another client updated the same model, resulting in a conflict',
  getMessage,
};

module.exports = {
  CONFLICT,
};
