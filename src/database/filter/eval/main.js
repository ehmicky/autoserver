'use strict';

const { has, get } = require('../../../utilities');

const { operators } = require('./operators');

// Check if a set of `attrs` matches a filter such as `args.filter` or
// `model.authorize`
const evalFilter = function ({
  attrs,
  filter,
  filter: { type, attrName, value } = {},
  partialNames,
}) {
  // E.g. when there is no `args.filter`
  if (type === undefined) { return true; }

  if (isPartial({ partialNames, attrName })) { return filter; }

  const attr = getAttr({ attrs, attrName });
  // `evalFilter` is passed for recursion
  return operators[type]({ attr, attrs, value, partialNames, evalFilter });
};

// Nodes marked as partial, i.e. whose name matches the `partialNames` regexp,
// are unknown, i.e. left as is unless they can be deduced from boolean logic.
const isPartial = function ({ partialNames, attrName }) {
  if (attrName === undefined || partialNames === undefined) { return false; }

  return partialNames.test(attrName);
};

// Attribute names can use dot-notation for deep access
const getAttr = function ({ attrs, attrName }) {
  if (attrName === undefined) { return; }

  const path = attrName.split('.');

  if (!has(attrs, path)) { return; }

  return get(attrs, path);
};

module.exports = {
  evalFilter,
};
