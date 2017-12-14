'use strict';

const { dirname } = require('path');

const { validateCircularRefs } = require('./circular_refs');
const { load } = require('./load');
const { findRefs } = require('./find');
const { getPath } = require('./path');
const { mergeRefs } = require('./merge');

// Dereference JSON references, i.e. $ref
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path" } will be replaced by the target, which must be
// a local path or a Node module ending with `.node`
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be deeply merged (with higher priority),
// although this is not standard|spec behavior.
// This function is called recursively, which is why it is passed to children
const dereferenceRefs = async function ({ path, paths }) {
  const pathsA = validateCircularRefs({ path, paths });

  const content = await load({ path });

  const refs = findRefs({ content });

  const dir = dirname(path);
  const refsA = refs
    .map(({ value, keys }) => resolveRef({ dir, value, keys, paths: pathsA }));
  const refsB = await Promise.all(refsA);

  const contentA = mergeRefs({ content, refs: refsB });

  return contentA;
};

// Resolve all JSON references to the value they point to
const resolveRef = async function ({ dir, value, keys, paths }) {
  // Remove `$ref` from keys
  const keysA = keys.slice(0, -1);

  const path = getPath({ dir, value });

  // Recursion
  const refContent = await dereferenceRefs({ path, paths });

  return { keys: keysA, path, refContent };
};

module.exports = {
  dereferenceRefs,
};
