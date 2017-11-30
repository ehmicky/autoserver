'use strict';

const { willPaginate } = require('../condition');
const { getBackwardResponse } = require('../backward');

const { getPaginationOutput } = require('./response');

// Add response metadata related to pagination
const handlePaginationOutput = function ({
  top,
  args,
  topargs,
  runOpts,
  response,
  ...rest
}) {
  if (!willPaginate({ top, args, runOpts, ...rest })) { return; }

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
