'use strict';

const operations = require('./operations');

// Apply `nooutput` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const nooutput = async function (nextFunc, input) {
  const response = await nextFunc(input);

  const newResponse = getResponse({ input, response });
  return newResponse;
};

const getResponse = function ({
  input: { operation, settings: { nooutput: nooutputSettings } },
  response,
  response: { actions },
}) {
  const isDelete = actions && actions.some(({ type }) => type === 'delete');
  const shouldRemoveOutput = isDelete || nooutputSettings;
  if (!shouldRemoveOutput) { return response; }

  return operations[operation].nooutput(response);
};

module.exports = {
  nooutput,
};
