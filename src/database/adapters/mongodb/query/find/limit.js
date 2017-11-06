'use strict';

// Apply `args.pagesize`
const limitResponse = function ({ cursor, limit }) {
  if (limit === undefined) { return cursor; }

  return cursor.limit(limit);
};

module.exports = {
  limitResponse,
};
