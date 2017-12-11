'use strict';

const { omit, mapValues, deepMerge } = require('../../utilities');

// Applies `schema.collections.default` to each collection
const applyCollsDefault = function ({
  schema: { collections = {}, collections: { default: collDefault } = {} },
}) {
  const collectionsA = omit(collections, ['default']);
  const collectionsB = mapValues(
    collectionsA,
    coll => applyCollDefault({ coll, collDefault }),
  );

  return { collections: collectionsB };
};

const applyCollDefault = function ({ coll, collDefault }) {
  const shouldApply = isProperColl(collDefault) && isProperColl(coll);
  if (!shouldApply) { return coll; }

  return deepMerge(collDefault, coll);
};

const isProperColl = function (coll) {
  return coll != null && typeof coll === 'object';
};

module.exports = {
  applyCollsDefault,
};
