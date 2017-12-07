'use strict';

const { get, set, omit, deepMerge } = require('../utilities');

// Merge resolved JSON reference value back to original document
const setRefs = function ({ content, refs }) {
  return refs.reduce(setRef, content);
};

const setRef = function (content, { keys, hasSiblings, refContent }) {
  const parent = get(content, keys);
  const parentA = omit(parent, '$ref');
  const parentB = mergeRef({ parent: parentA, hasSiblings, refContent });

  const contentA = set(content, keys, parentB);
  return contentA;
};

const mergeRef = function ({ parent, hasSiblings, refContent }) {
  if (!hasSiblings) { return refContent; }

  return deepMerge(parent, refContent);
};

module.exports = {
  setRefs,
};
