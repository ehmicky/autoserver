'use strict';

const { assignArray, uniq } = require('../utilities');

const { crawlNodes } = require('./crawl');

// Returns all the database features needed by this filter
const getFeatures = function ({ filter }) {
  if (filter === undefined) { return []; }

  const features = crawlNodes(filter, getFeature)
    .reduce(assignArray, []);
  const featuresA = uniq(features);
  return featuresA;
};

const getFeature = function ({ type, attrName }) {
  // Simple filters, i.e. { id: string } and { id: { in: array } }
  // do not require any feature, because every database adapter should
  // support them, since many things depend on those basic operations.
  if (attrName === 'id' && ['in', 'eq'].includes(type)) { return []; }

  return [`filter:${type}`];
};

module.exports = {
  getFeatures,
};
