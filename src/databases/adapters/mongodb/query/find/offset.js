'use strict';

// Apply `args.page`
const offsetResponse = function ({ cursor, offset }) {
  if (offset === undefined) { return cursor; }

  return cursor.offset(offset);
};

module.exports = {
  offsetResponse,
};
