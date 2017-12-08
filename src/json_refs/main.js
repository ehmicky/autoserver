'use strict';

const { dirname } = require('path');

const { cachedDereference } = require('./cache');
const { load } = require('./load');
const { findRefs } = require('./find');
const { resolveRef } = require('./resolve');
const { setRefs } = require('./merge');
const { setRefPath } = require('./ref_path');

// Dereference JSON references, i.e. $ref
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path" } will be replaced by the target, which must be
// a local path or a Node module ending with `.node`
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be deeply merged (with higher priority),
// although this is not standard|spec behavior.
const dereferenceSchema = function ({ schema }) {
  return cachedDereference({ path: schema, dereferenceRefs });
};

// This function is called recursively, which is why it is passed to children
const dereferenceRefs = async function ({
  rootDir,
  path,
  refPath,
  hasSiblings,
  varKeys = [],
  cache,
}) {
  const { dir, rootDir: rootDirA, isTopLevel } = getDirs({ rootDir, path });

  const content = await load({ path, hasSiblings, varKeys });

  const refs = findRefs({ content });

  const refsA = refs.map(({ value, keys }) => resolveRef({
    rootDir: rootDirA,
    dir,
    content,
    value,
    keys,
    varKeys,
    cache,
    dereferenceRefs,
  }));
  const refsB = await Promise.all(refsA);

  const contentA = setRefs({ content, refs: refsB });

  const contentB = setRefPath({ content: contentA, refPath, isTopLevel });

  return contentB;
};

// `rootDir` is the initial file's directory, `dir` is for the current file
const getDirs = function ({ rootDir, path }) {
  const isTopLevel = rootDir === undefined;

  const dir = dirname(path);
  const rootDirA = rootDir || dir;

  return { dir, rootDir: rootDirA, isTopLevel };
};

module.exports = {
  dereferenceSchema,
};
