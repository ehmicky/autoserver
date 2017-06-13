'use strict';


const { orderBy, map } = require('lodash');


// Apply sorting, paginating, etc. on response
const processResponse = function ({
  response: { data, metadata },
  command,
  opts: { nOrderBy, limit, offset },
}) {
  data = sortResponse({ data, nOrderBy });
  data = offsetResponse({ data, offset });
  data = limitResponse({ data, limit });

  if (metadata === undefined) {
    metadata = command.multiple ? Array(data.length).fill({}) : {};
  }

  return { data, metadata };
};

// order_by sorting
const sortResponse = function ({ data, nOrderBy }) {
  if (!data || !(data instanceof Array)) { return data; }

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


module.exports = {
  processResponse,
};
