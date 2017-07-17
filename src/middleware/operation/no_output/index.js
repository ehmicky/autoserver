'use strict';

const operations = require('./operations');

// Apply `noOutput` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - defaults to true for `delete`, false otherwise
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const noOutput = async function (input) {
  const { operation, log, settings } = input;
  let response = await this.next(input);
  const perf = log.perf.start('operation.noOutput', 'middleware');

  const isDelete = response.actions &&
    response.actions.some(({ type }) => type === 'delete');
  const shouldRemoveOutput = isDelete || settings.noOutput;

  if (shouldRemoveOutput) {
    response = operations[operation].noOutput(response);
  }

  perf.stop();
  return response;
};

module.exports = {
  noOutput,
};
