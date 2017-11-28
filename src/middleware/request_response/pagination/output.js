'use strict';

const { pick } = require('../../../utilities');

const {
  isOffset,
  getLimit,
  hasToken,
  SAME_ARGS,
  BOUNDARY_TOKEN,
} = require('./info');
const { encode } = require('./encoding');
const { isOnlyForwardCursor } = require('./condition');

// Add response metadata related to pagination:
//   token, pagesize, has_previous_page, has_next_page
// Also removes the extra model fetched to guess has_next_page
const getPaginationOutput = function ({
  top,
  args,
  topargs,
  runOpts,
  response,
}) {
  const hasPreviousPage = getHasPreviousPage({ args, top });
  const hasNextPage = getHasNextPage({ args, runOpts, response });

  const data = getData({ response, hasNextPage });

  const pagesize = data.length;

  const pageOrToken = getPageOrToken({
    top,
    args,
    topargs,
    data,
    hasPreviousPage,
    hasNextPage,
  });

  const pages = { pagesize, ...pageOrToken };
  return { data, metadata: { ...response.metadata, pages } };
};

const getHasPreviousPage = function ({ args, args: { page }, top }) {
  if (isOffset({ args })) {
    return page !== 1;
  }

  // If a token (except BOUNDARY_TOKEN) has been used,
  // it means there is a previous page
  return hasToken({ args }) && !isOnlyForwardCursor({ top });
};

// We fetch an extra model to guess has_next_page. If it was founds, remove it
const getHasNextPage = function ({ args, runOpts, response }) {
  const limit = getLimit({ args, runOpts });
  return response.data.length === limit;
};

const getData = function ({ response: { data }, hasNextPage }) {
  if (!hasNextPage) {
    return data;
  }

  return data.slice(0, -1);
};

const getPageOrToken = function ({
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
  getPaginationOutput,
};
