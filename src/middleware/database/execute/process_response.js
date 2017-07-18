'use strict';

const { orderBy, map } = require('lodash');

// Apply sorting, paginating, etc. on response
const processResponse = function ({
  response,
  command,
  opts: { nOrderBy, limit, offset },
}) {
  const sortedData = sortResponse({ data: response.data, nOrderBy });
  const offsetData = offsetResponse({ data: sortedData, offset });
  const data = limitResponse({ data: offsetData, limit });

  const metadata = getMetadata({ metadata: response.metadata, command, data });

  return { data, metadata };
};

// `order_by` sorting
const sortResponse = function ({ data, nOrderBy }) {
  if (!data || !Array.isArray(data)) { return data; }

  const sortedData = orderBy(
    data,
    map(nOrderBy, 'attrName'),
    map(nOrderBy, 'order')
  );
  return sortedData;
};

// Pagination offsetting
// If offset is too big, just return empty array
const offsetResponse = function ({ data, offset }) {
  if (offset === undefined) { return data; }
  return data.slice(offset);
};

// Pagination limiting
const limitResponse = function ({ data, limit }) {
  if (limit === undefined) { return data; }
  return data.slice(0, limit);
};

const getMetadata = function ({ metadata, command, data }) {
  if (metadata !== undefined) { return metadata; }

  return command.multiple ? Array(data.length).fill({}) : {};
};

module.exports = {
  processResponse,
};
