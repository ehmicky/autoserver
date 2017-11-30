'use strict';

const { pick } = require('../../../../utilities');
const { isOffset, SAME_ARGS, BOUNDARY_TOKEN } = require('../info');
const { encode } = require('../encoding');
const { isOnlyForwardCursor } = require('../condition');

const getMetadata = function ({
  data,
  top,
  args,
  args: { page },
  topargs,
  hasPrevPage,
  hasNextPage,
}) {
  if (isOffset({ args })) {
    return { page, has_prev_page: hasPrevPage, has_next_page: hasNextPage };
  }

  const prev = getPrevTokens({ data, args, topargs, hasPrevPage });
  const next = getNextTokens({ data, top, args, topargs, hasNextPage });

  return { ...prev, ...next };
};

const getPrevTokens = function ({ data, args, topargs, hasPrevPage }) {
  if (!hasPrevPage) { return; }

  const [model] = data;
  const prevToken = getEncodedToken({ model, args, topargs });

  return {
    has_prev_page: hasPrevPage,
    prev_token: prevToken,
    last_token: BOUNDARY_TOKEN,
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
    first_token: lastToken,
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
