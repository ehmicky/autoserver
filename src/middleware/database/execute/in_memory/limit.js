'use strict';

// Pagination limiting
const limitResponse = function ({ data, limit }) {
  if (limit === undefined) { return data; }

  return data.slice(0, limit);
};

module.exports = {
  limitResponse,
};
