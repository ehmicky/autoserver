'use strict';

const { pick } = require('../../../utilities');

const { getPaginationInfo } = require('./info');
const { decode, encode } = require('./encoding');

// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
// Also removes the extra model fetched to guess has_next_page
const getPaginationOutput = function ({ args, args: { page }, response }) {
  const {
    hasToken,
    token,
    previous,
    next,
    usedPageSize,
    isBackward,
    isOffset,
  } = getPaginationInfo({ args });

  // If a token (except '') has been used, it means there is a previous page
  // We use ${previous} amd ${next} to reverse directions
  // when doing backward pagination
  const firstHasPreviousPage = isOffset ? page !== 1 : hasToken;

  // We fetch an extra model to guess has_next_page. If it was founds, remove it
  const lastHasNextPage = response.data.length === usedPageSize;

  const info = {
    [`has_${previous}_page`]: firstHasPreviousPage,
    [`has_${next}_page`]: lastHasNextPage,
  };

  const { data, metadata } = getData({ response, lastHasNextPage, isBackward });

  const pageSize = data.length;

  // Add response.metadata
  const metadataA = data.map((model, index) => {
    // `has_previous_page` and `has_next_page` are only true
    // when on the batch's edges
    const hasPreviousPage = info.has_previous_page || index !== 0;
    const hasNextPage = info.has_next_page || index !== data.length - 1;

    const pageOrToken = getPageOrToken({ isOffset, page, model, args, token });
    const pages = {
      has_previous_page: hasPreviousPage,
      has_next_page: hasNextPage,
      page_size: pageSize,
      ...pageOrToken,
    };

    const metadatum = metadata && metadata[index];
    return { ...metadatum, pages };
  });

  return { data, metadata: metadataA };
};

const getData = function ({
  response: { data, metadata },
  lastHasNextPage,
  isBackward,
}) {
  if (!lastHasNextPage) {
    return { data, metadata };
  }

  if (isBackward) {
    return {
      data: data.slice(1),
      metadata: metadata.slice(1),
    };
  }

  return {
    data: data.slice(0, -1),
    metadata: metadata.slice(0, -1),
  };
};

const getPageOrToken = function ({
  isOffset,
  page,
  model,
  args: { orderBy, filter },
  token,
}) {
  if (isOffset) { return { page }; }

  const tokenA = getPaginationToken({ model, orderBy, filter, token });
  return { token: tokenA };
};

// Calculate token to output
const getPaginationToken = function ({ model, orderBy, filter, token }) {
  const tokenObj = getTokenObj({ orderBy, filter, token });
  const parts = tokenObj.orderBy.map(({ attrName }) => model[attrName]);
  const tokenObjA = { ...tokenObj, parts };
  const encodedToken = encode({ token: tokenObjA });
  return encodedToken;
};

const getTokenObj = function ({ orderBy, filter, token }) {
  if (token === undefined || token === '') {
    return { orderBy, filter };
  }

  // Reuse old token
  const oldToken = decode({ token });
  return pick(oldToken, ['orderBy', 'filter']);
};

module.exports = {
  getPaginationOutput,
};
