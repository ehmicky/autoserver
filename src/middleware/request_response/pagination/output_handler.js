'use strict';

const { willPaginateOutput } = require('./condition');
const { getPaginationOutput } = require('./output');
const { getBackwardResponse } = require('./backward');

// Add response metadata related to pagination:
//   token, pagesize, has_previous_page, has_next_page
const handlePaginationOutput = function ({
  top,
  args,
  topargs,
  runOpts,
  response,
  ...rest
}) {
  if (!willPaginateOutput({ top, args, runOpts, ...rest })) { return; }

  const responseA = getPaginationOutput({
    top,
    args,
    topargs,
    runOpts,
    response,
  });

  const responseB = getBackwardResponse({ args, response: responseA });

  return { response: responseB };
};

module.exports = {
  handlePaginationOutput,
};
