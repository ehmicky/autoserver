'use strict';

const { uniq } = require('lodash');

// Returns simple `args.filter` that only filters by `model.id`
const getSimpleFilter = function ({ ids }) {
  return ids.length === 1
    ? { attrName: 'id', type: 'eq', value: ids[0] }
    : { attrName: 'id', type: 'in', value: uniq(ids) };
};

module.exports = {
  getSimpleFilter,
};
