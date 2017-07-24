'use strict';

const operations = require('./operations');

// Apply `noOutput` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const noOutput = async function (nextFunc, input) {
  const response = await nextFunc(input);

  const newResponse = getResponse({ input, response });
  return newResponse;
};

const getResponse = function ({
  input: { operation, settings: { noOutput: noOutputSettings } },
  response,
  response: { actions },
}) {
  const isDelete = actions && actions.some(({ type }) => type === 'delete');
  const shouldRemoveOutput = isDelete || noOutputSettings;
  if (!shouldRemoveOutput) { return response; }

  return operations[operation].noOutput(response);
};

module.exports = {
  noOutput,
};
