'use strict';

const { reverseArray } = require('../../../utilities');

const { mustPaginateOutput } = require('./condition');
const { getPaginationOutput } = require('./output');
const { getPaginationInfo } = require('./info');

// Add response metadata related to pagination:
//   token, pagesize, has_previous_page, has_next_page
const handlePaginationOutput = function ({ args, command, response }) {
  if (!mustPaginateOutput({ args, command })) { return; }

  const responseA = reverseOutput({ args, response });

  getPaginationOutput({ args, response: responseA });

  return { response };
};

// When using args.before, pagination is performed backward.
// We do this by inversing args.order, which means we need to reverse output
// afterwards.
const reverseOutput = function ({ args, response }) {
  const { isBackward } = getPaginationInfo({ args });
  if (!isBackward) { return response; }

  const data = reverseArray(response.data);
  return { ...response, data };
};

module.exports = {
  handlePaginationOutput,
};
