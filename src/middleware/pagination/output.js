'use strict';


const { getPaginationInfo } = require('./info');
const { encode } = require('./encoding');


// Add response metadata related to pagination: token, page_size, has_previous_page, has_next_page
// Also removes the extra model fetched to guess has_next_page
const getPaginationOutput = function ({ args, response: { data, metadata } }) {
  const { order_by: orderBy, filter } = args;
  const { hasToken, previous, next, usedPageSize, isBackward } = getPaginationInfo({ args });

  const info = {};
  // If a token (except '') has been used, it means there is a previous page
  // We use ${previous} amd ${next} to reverse directions when doing backward pagination
  info[`has_${previous}_page`] = hasToken;

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
    // has_previous_page and has_next_page are only true when on the batch's edges
    const hasPreviousPage = info.has_previous_page || index !== 0;
    const hasNextPage = info.has_next_page || index !== data.length - 1;
    const token = getPaginationToken({ model, orderBy, filter });

    const pages = {
      has_previous_page: hasPreviousPage,
      has_next_page: hasNextPage,
      token,
      page_size: pageSize,
    };
    return Object.assign({}, metadata[index], { pages });
  });

  return { data, metadata: newMetadata };
};

// Calculate token to output
const getPaginationToken = function ({ model, orderBy, filter }) {
  const parts = orderBy.map(({ attrName }) => model[attrName]);
  const token = { orderBy, filter, parts };
  const encodedToken = encode({ token });
  return encodedToken;
};


module.exports = {
  getPaginationOutput,
};
