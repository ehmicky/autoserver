'use strict';

const { cwd } = require('process');

const { getPath } = require('./path');
const { load } = require('./load');
const { setRef } = require('./ref_path');
const { findRefs } = require('./find');
const { mergeRef } = require('./merge');

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
}) {
  const pathA = getPath({ path, parentPath });

  const content = await getContent({ path: pathA, cache });

  return content;
};

const getContent = async function ({ path, cache }) {
  // A parent or sibling has already resolved that JSON reference
  // This also helps handling recursive references
  if (cache[path] !== undefined) { return cache[path]; }

  const content = await load({ path });

  setRef(content, path);

  // We must directly mutate to handle recursions, and also for performance
  // optimizations (so it can be shared between siblings)
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  cache[path] = content;

  const refs = findRefs({ content });

  const promises = refs.map(({ value, keys }) => resChild({
    path: value,
    keys,
    parentPath: path,
    content,
    cache,
  }));
  await Promise.all(promises);

  return content;
};

// Resolve child JSON reference to the value it points to,
// then merge it to parent
const resChild = async function ({ path, keys, parentPath, content, cache }) {
  // Recursion
  const refContent = await dereferenceRefs({ path, parentPath, cache });

  mergeRef({ content, keys, refContent });
};

module.exports = {
  dereferenceRefs,
};
