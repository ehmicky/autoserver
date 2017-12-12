'use strict';

const { willPaginate } = require('../condition');
const { getBackwardResponse } = require('../backward');

const { getPaginationOutput } = require('./response');

// Add response metadata related to pagination
const handlePaginationOutput = function ({
  top,
  args,
  topargs,
  config,
  response,
  ...rest
}) {
  if (!willPaginate({ top, args, config, ...rest })) { return; }

  const responseA = getPaginationOutput({
    top,
    args,
    topargs,
    config,
    response,
  });

  const responseB = getBackwardResponse({ args, response: responseA });

  return { response: responseB };
};

module.exports = {
  handlePaginationOutput,
};
