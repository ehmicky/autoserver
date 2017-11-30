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
  result: { model, metadata },
  attrName,
  nestedPagesize,
}) {
  const { [attrName]: attrVal } = model;
  const noPagination = !Array.isArray(attrVal) ||
    attrVal.length <= nestedPagesize;

  if (noPagination) { return result; }

  const attrValA = attrVal.slice(0, nestedPagesize);
  const modelA = { ...model, [attrName]: attrValA };

  const metadataA = {
    ...metadata,
    pages: { ...metadata.pages, nested_pagesize: nestedPagesize },
  };
  const resultA = { ...result, model: modelA, metadata: metadataA };
  return resultA;
};

module.exports = {
  truncateAttrs,
};
