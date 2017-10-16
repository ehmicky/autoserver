'use strict';

const { validateMissingIds } = require('./missing_id');
const { modelMatchFilter } = require('./operators');
const { sortResponse } = require('./order_by');
const { offsetResponse } = require('./offset');
const { limitResponse } = require('./limit');

// Retrieve models
const find = function ({ collection, filter, orderBy, offset, limit }) {
  validateMissingIds({ collection, filter });

  const data = collection.filter(model => modelMatchFilter({ model, filter }));

  const dataA = sortResponse({ data, orderBy });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });

  return dataC;
};

module.exports = {
  find,
};
