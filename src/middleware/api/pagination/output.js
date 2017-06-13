'use strict';


const { getPaginationInfo } = require('./info');
const { decode, encode } = require('./encoding');


// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
// Also removes the extra model fetched to guess has_next_page
const getPaginationOutput = function ({ args, response: { data, metadata } }) {
  const { orderBy, filter, page } = args;
  const {
    hasToken,
    token,
    previous,
    next,
    usedPageSize,
    isBackward,
    isOffsetPagination,
  } = getPaginationInfo({ args });

  const info = {};
  if (isOffsetPagination) {
    info[`has_${previous}_page`] = page !== 1;
  // If a token (except '') has been used, it means there is a previous page
  // We use ${previous} amd ${next} to reverse directions
  // when doing backward pagination
  } else {
    info[`has_${previous}_page`] = hasToken;
  }

  // We fetch an extra model to guess has_next_page. If it was founds, remove it
  if (data.length === usedPageSize) {
    info[`has_${next}_page`] = true;
    if (isBackward) {
      data = data.slice(1);
      metadata = metadata.slice(1);
    } else {
      data = data.slice(0, -1);
      metadata = metadata.slice(0, -1);
    }
  }

  const pageSize = data.length;

  // Add response.metadata
  const newMetadata = data.map((model, index) => {
    // has_previous_page and has_next_page are only true
    // when on the batch's edges
    const hasPreviousPage = info.has_previous_page || index !== 0;
    const hasNextPage = info.has_next_page || index !== data.length - 1;

    const pages = {
      has_previous_page: hasPreviousPage,
      has_next_page: hasNextPage,
      page_size: pageSize,
    };

    if (isOffsetPagination) {
      pages.page = page;
    } else {
      pages.token = getPaginationToken({ model, orderBy, filter, token });
    }

    return Object.assign({}, metadata[index], { pages });
  });

  return { data, metadata: newMetadata };
};

// Calculate token to output
const getPaginationToken = function ({ model, orderBy, filter, token }) {
  // Reuse old token
  if (token !== undefined && token !== '') {
    const oldToken = decode({ token });
    orderBy = oldToken.orderBy;
    filter = oldToken.filter;
  }

  const parts = orderBy.map(({ attrName }) => model[attrName]);
  const tokenObj = { orderBy, filter, parts };
  const encodedToken = encode({ token: tokenObj });
  return encodedToken;
};


module.exports = {
  getPaginationOutput,
};
