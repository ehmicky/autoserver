'use strict';

// Truncate nested attributes to fit `nestedPagesize`
// Append a `null` after truncating
const truncateAttrs = function ({ results, nestedAttrs, nestedPagesize }) {
  return nestedAttrs.reduce(
    (resultsA, { attrName }) =>
      truncateAttr({ results: resultsA, attrName, nestedPagesize }),
    results,
  );
};

const truncateAttr = function ({ results, attrName, nestedPagesize }) {
  return results
    .map(result => truncateModel({ result, attrName, nestedPagesize }));
};

const truncateModel = function ({
  result,
  result: { model },
  attrName,
  nestedPagesize,
}) {
  const { [attrName]: attrVal } = model;
  const noPagination = !Array.isArray(attrVal) ||
    attrVal.length <= nestedPagesize;

  if (noPagination) { return result; }

  const attrValA = attrVal.slice(0, nestedPagesize);
  // We hint that the attribute was paginated by appending a `null`
  const attrValB = [...attrValA, null];
  const modelA = { ...model, [attrName]: attrValB };

  const resultA = { ...result, model: modelA };
  return resultA;
};

module.exports = {
  truncateAttrs,
};
