'use strict';

const operations = require('./operations');

// Apply `silent` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const silent = function (input) {
  const inputA = applySilent({ input });
  return inputA;
};

const applySilent = function ({
  input,
  input: {
    operation,
    settings: { silent: silentSettings },
    response,
    response: { actions },
  },
}) {
  const isDelete = actions && actions.some(({ type }) => type === 'delete');
  const shouldRemoveOutput = isDelete || silentSettings;
  if (!shouldRemoveOutput) { return input; }

  const responseA = operations[operation].silent(response);
  return { ...input, responseA };
};

module.exports = {
  silent,
};
