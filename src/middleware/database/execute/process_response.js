'use strict';

const { orderBy: orderByFunc, map } = require('lodash');

// Apply sorting, paginating, etc. on response
const processResponse = function ({ data, opts: { orderBy, limit, offset } }) {
  const dataA = sortResponse({ data, orderBy });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });
  return dataC;
};

// `order_by` sorting
const sortResponse = function ({ data, orderBy }) {
  if (!data || !Array.isArray(data)) { return data; }

  return orderByFunc(data, map(orderBy, 'attrName'), map(orderBy, 'order'));
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
