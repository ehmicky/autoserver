'use strict';

const { flatten } = require('../../../../utilities');

// Retrieve `nestedPagesize`, which is the pagesize applied to nested actions
// We try to maximize it, while still be under the `maxmodels` limit
const getNestedPagesize = function ({ results, nestedAttrs, maxmodels }) {
  const count = results.length;
  const nestedLengths = getNestedLengths({ results, nestedAttrs });
  const nestedPagesize = findNestedPagesize({
    nestedLengths,
    count,
    maxmodels,
  });
  return nestedPagesize;
};

// Retrieve, for each model x nested attribute combination, a
// `{ length, weight }` object with `length` being the length of the nested
// attribute (1 if it is not an array) and `weight` the number of nested
// actions implied
const getNestedLengths = function ({ results, nestedAttrs }) {
  const nestedLengths = results
    .map(({ model }) => getNestedLength({ model, nestedAttrs }));
  const nestedLengthsA = flatten(nestedLengths);
  return nestedLengthsA;
};

const getNestedLength = function ({ model, nestedAttrs }) {
  return nestedAttrs
    .map(({ attrName, weight }) => getLength(({ model, attrName, weight })))
    .filter(({ length }) => length > 0);
};

const getLength = function ({ model, attrName, weight }) {
  const attrVal = model[attrName];

  if (attrVal == null) {
    return { length: 0 };
  }

  const length = Array.isArray(attrVal) ? attrVal.length : 1;
  return { length, weight };
};

// Recursively try incrementing `nestedPagesize` until we hit `maxmodels` limit
const findNestedPagesize = function ({
  nestedLengths,
  count,
  maxmodels,
  nestedPagesize = 0,
}) {
  // No nested pagination needed to be under `maxmodels` limit
  if (nestedLengths.length === 0) { return Infinity; }

  // Guess how many models would be added by incrementing `nestedPagesize`
  const nestedLengthsA = nestedLengths
    .filter(({ length }) => length > nestedPagesize);
  const weightsA = nestedLengthsA
    .reduce((weights, { weight }) => weights + weight, 0);
  const countA = count + weightsA;

  // `maxmodels` limit has been hit
  if (countA > maxmodels) {
    // `nestedPagesize` should never be below 1, because we enforce `maxmodels`
    // to be >= (maxActions - 1) * pagesize
    // However, we ensure it just in case
    // Either throwing an error or paginating with nestedPagesize 0 would
    // result in poor client experience.
    return Math.max(nestedPagesize, 1);
  }

  return findNestedPagesize({
    nestedLengths: nestedLengthsA,
    count: countA,
    maxmodels,
    nestedPagesize: nestedPagesize + 1,
  });
};

module.exports = {
  getNestedPagesize,
};
