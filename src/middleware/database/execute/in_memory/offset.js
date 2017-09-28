'use strict';

// Pagination offsetting
// If offset is too big, just return empty array
const offsetResponse = function ({ data, offset }) {
  if (offset === undefined) { return data; }

  return data.slice(offset);
};

module.exports = {
  offsetResponse,
};
