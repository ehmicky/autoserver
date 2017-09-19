'use strict';

const operations = require('./operations');

// Apply `silent` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const silent = function ({
  operation,
  settings: { silent: silentSettings },
  response,
}) {
  if (!silentSettings) { return; }

  const responseA = operations[operation].silent(response);
  return { response: responseA };
};

module.exports = {
  silent,
};
