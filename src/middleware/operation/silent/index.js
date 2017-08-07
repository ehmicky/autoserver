'use strict';

const operations = require('./operations');

// Apply `silent` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const silent = async function (nextFunc, input) {
  const response = await nextFunc(input);

  const newResponse = getResponse({ input, response });
  return newResponse;
};

const getResponse = function ({
  input: { operation, settings: { silent: silentSettings } },
  response,
  response: { actions },
}) {
  const isDelete = actions && actions.some(({ type }) => type === 'delete');
  const shouldRemoveOutput = isDelete || silentSettings;
  if (!shouldRemoveOutput) { return response; }

  return operations[operation].silent(response);
};

module.exports = {
  silent,
};
