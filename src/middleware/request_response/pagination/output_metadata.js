'use strict';

const { pick } = require('../../../utilities');

const { isOffset, SAME_ARGS, BOUNDARY_TOKEN } = require('./info');
const { encode } = require('./encoding');
const { isOnlyForwardCursor } = require('./condition');

const getMetadata = function ({
  data,
  top,
  args,
  args: { page },
  topargs,
  hasPreviousPage,
  hasNextPage,
}) {
  if (isOffset({ args })) {
    return {
      page,
      has_previous_page: hasPreviousPage,
      has_next_page: hasNextPage,
    };
  }

  const previous = getPreviousTokens({ data, args, topargs, hasPreviousPage });
  const next = getNextTokens({ data, top, args, topargs, hasNextPage });

  return { ...previous, ...next };
};

const getPreviousTokens = function ({ data, args, topargs, hasPreviousPage }) {
  if (!hasPreviousPage) { return; }

  const [model] = data;
  const previousToken = getEncodedToken({ model, args, topargs });

  return {
    has_previous_page: hasPreviousPage,
    previous_token: previousToken,
    first_token: BOUNDARY_TOKEN,
  };
};

const getNextTokens = function ({ data, top, args, topargs, hasNextPage }) {
  if (!hasNextPage) { return; }

  const model = data[data.length - 1];
  const nextToken = getEncodedToken({ model, args, topargs });
  // `last_token` is not useful with patch commands
  const lastToken = isOnlyForwardCursor({ top }) ? undefined : BOUNDARY_TOKEN;

  return {
    has_next_page: hasNextPage,
    next_token: nextToken,
    last_token: lastToken,
  };
};

// Calculate token to output
const getEncodedToken = function ({ model, args: { order }, topargs }) {
  // If the previous batch declared a next batch was available, but between
  // the two requests, the next batch's models were removed, `model` will be
  // `undefined`, so we return the `first_token|last_token` instead
  if (model === undefined) { return BOUNDARY_TOKEN; }

  const parts = order.map(({ attrName }) => model[attrName]);

  const token = pick(topargs, SAME_ARGS);
  const tokenA = { ...token, parts };

  const encodedToken = encode({ token: tokenA });
  return encodedToken;
};

module.exports = {
  getMetadata,
};
