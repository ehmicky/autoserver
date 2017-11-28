'use strict';

const { isOffset, getLimit, hasToken } = require('./info');
const { isOnlyForwardCursor } = require('./condition');
const { getMetadata } = require('./output_metadata');

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

  const metadata = getMetadata({
    top,
    args,
    topargs,
    data,
    hasPreviousPage,
    hasNextPage,
  });

  const pages = { pagesize, ...metadata };
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

module.exports = {
  getPaginationOutput,
};
