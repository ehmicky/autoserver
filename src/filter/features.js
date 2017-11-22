'use strict';

const { flatten, uniq } = require('../utilities');

const { crawlNodes } = require('./crawl');
const { isSiblingValue } = require('./siblings');

// Returns all the database features needed by this filter
const getFeatures = function ({ filter }) {
  if (filter === undefined) { return []; }

  const features = crawlNodes(filter, getFeature);
  const featuresA = flatten(features);
  const featuresB = uniq(featuresA);
  return featuresB;
};

const getFeature = function ({ type, attrName, value }) {
  // $model.ATTR targetting a sibling in `args.filter`
  if (isSiblingValue({ value })) { return ['filter:sibling']; }

  // Simple filters, i.e. { id: string } and { id: { _in: array } }
  // do not require any feature, because every database adapter should
  // support them, since many things depend on those basic operations.
  if (attrName === 'id' && ['_in', '_eq'].includes(type)) { return []; }

  return [`filter:${type}`];
};

module.exports = {
  getFeatures,
};
