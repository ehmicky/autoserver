'use strict';

const { get, set, omit, deepMerge } = require('../utilities');

const { setRef } = require('./ref_path');

// Merge resolved JSON reference value back to original document
const mergeRefs = function ({ content, refs }) {
  return refs.reduce(mergeRef, content);
};

const mergeRef = function (content, { keys, refContent, path }) {
  const parent = get(content, keys);

  const parentA = mergeRefContent({ parent, refContent });

  const parentB = setRef(parentA, path);

  const contentA = set(content, keys, parentB);
  return contentA;
};

const mergeRefContent = function ({ parent, refContent }) {
  const hasSiblings = Object.keys(parent).length > 1;
  if (!hasSiblings) { return refContent; }

  const parentA = omit(parent, '$ref');
  return deepMerge(parentA, refContent);
};

module.exports = {
  mergeRefs,
};
