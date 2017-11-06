'use strict';

const { evalFilter } = require('../../../../../filter');

const { sortResponse } = require('./orderby');
const { offsetResponse } = require('./offset');
const { limitResponse } = require('./limit');

// Retrieve models
const find = function ({ collection, filter, orderby, offset, limit }) {
  const data = collection.filter(model => evalFilter({ attrs: model, filter }));

  const dataA = sortResponse({ data, orderby });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });

  return dataC;
};

module.exports = {
  find,
};
