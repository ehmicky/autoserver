'use strict';

const { cwd } = require('process');

const { isObjectType } = require('../utilities');

const { getPath } = require('./path');
const { fireCachedFunc } = require('./circular_refs');
const { load } = require('./load');
const { findRefs } = require('./find');
const { mergeChildren } = require('./merge');
const { setRef } = require('./ref_path');

// Dereference JSON references, i.e. $ref
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path" } will be replaced by the target, which must be
// a local path or a Node module ending with `.node`
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be deeply merged (with higher priority),
// although this is not standard|spec behavior.
// This function is called recursively, which is why it is passed to children
// Recursion is handled.
const dereferenceRefs = async function ({
  path = '',
  parentPath = cwd(),
  cache = {},
  stack = [],
}) {
  const pathA = getPath({ path, parentPath });

  const content = await cGetContent({ path: pathA, cache, stack });

  return content;
};

const getContent = async function ({ path, cache, stack }) {
  const content = await load({ path });

  const contentA = await dereferenceChildren({ content, path, cache, stack });

  const contentB = setRef({ content: contentA, path });

  return contentB;
};

const cGetContent = fireCachedFunc.bind(null, getContent);

// Dereference children JSON references
const dereferenceChildren = async function ({ content, path, cache, stack }) {
  // If the `content` is not an object or array, it won't have any children
  if (!isObjectType(content)) { return content; }

  const refs = findRefs({ content });

  const promises = refs.map(({ value, keys }) =>
    dereferenceChild({ path: value, keys, parentPath: path, cache, stack }));
  const children = await Promise.all(promises);

  const contentA = mergeChildren({ content, children });

  return contentA;
};

// Resolve child JSON reference to the value it points to
const dereferenceChild = async function ({ keys, ...rest }) {
  const refContent = await dereferenceRefs(rest);
  return { keys, refContent };
};

module.exports = {
  dereferenceRefs,
};
