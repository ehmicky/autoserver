'use strict';

// Matcher for bother 'and' and 'or' operators
const andOrMatcher = function (
  operator,
  { attrs, value, partialNames, evalFilter },
) {
  const operatorMap = andOrMap[operator];

  const valueA = value
    .map(filter => evalFilter({ attrs, filter, partialNames }));

  const hasSomeFalse = valueA.some(val => val === operatorMap.some);
  if (hasSomeFalse) { return operatorMap.some; }

  const valueB = valueA.filter(val => typeof val !== 'boolean');
  const hasPartialNodes = valueB.length > 0;

  if (hasPartialNodes) {
    return simplifyNode({ type: operator, value: valueB });
  }

  return operatorMap.every;
};

// Try to simplify a node when possible
const simplifyNode = function (node) {
  if (node.value.length === 1) { return node.value[0]; }

  return node;
};

const andOrMap = {
  and: { some: false, every: true },
  or: { some: true, every: false },
};

// Top-level array
const orMatcher = andOrMatcher.bind(null, 'or');

// Several fields inside a filter object
const andMatcher = andOrMatcher.bind(null, 'and');

// `{ array_attribute: { some: { ...} } }`
const someMatcher = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).some(index =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }));
};

// `{ array_attribute: { all: { ...} } }`
const allMatcher = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).every(index =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }));
};

const arrayMatcher = function ({
  attr,
  index,
  value,
  partialNames,
  evalFilter,
}) {
  const valueA = value.map(val => ({ ...val, attrName: index }));
  return andMatcher({ attrs: attr, value: valueA, partialNames, evalFilter });
};

module.exports = {
  or: orMatcher,
  and: andMatcher,
  some: someMatcher,
  all: allMatcher,
};
