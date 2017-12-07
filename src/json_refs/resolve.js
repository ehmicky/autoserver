'use strict';

const { resolve, relative } = require('path');

const { get } = require('../utilities');
const { addGenErrorHandler } = require('../error');

// Resolve all JSON references to the value they point to
const resolveRef = async function ({
  rootDir,
  dir,
  content,
  value,
  keys,
  varKeys,
  dereferenceRefs,
}) {
  // Remove `$ref` from keys
  const keysA = keys.slice(0, -1);

  const hasSiblings = refHasSiblings({ content, keys: keysA });

  // Locates the JSON reference within the root document
  const varKeysA = [...varKeys, ...keysA];

  const refPaths = getRefPaths({ rootDir, dir, value });

  // Recursion
  const refContent = await dereferenceRefs({
    rootDir,
    ...refPaths,
    varKeys: varKeysA,
    hasSiblings,
  });

  return { keys: keysA, hasSiblings, refContent };
};

// JSON references that have siblings are deeply merged
const refHasSiblings = function ({ content, keys }) {
  const parent = get(content, keys);
  const hasSiblings = Object.keys(parent).length > 1;
  return hasSiblings;
};

// Resolve JSON reference path to an absolute local file
const getRefPaths = function ({ rootDir, dir, value }) {
  if (value.endsWith('.node')) {
    return eGetModulePath({ value });
  }

  return getLocalPath({ rootDir, dir, value });
};

// Local file
const getLocalPath = function ({ rootDir, dir, value }) {
  const path = resolve(dir, value);
  const refPath = relative(rootDir, value);
  return { path, refPath };
};

// Node module, e.g. $ref: 'lodash.node'
const getModulePath = function ({ value }) {
  const moduleName = value.replace(/\.node$/, '');
  const path = require.resolve(moduleName);
  const refPath = value;
  return { path, refPath };
};

const eGetModulePath = addGenErrorHandler(getModulePath, {
  message: ({ value }) => `JSON reference '${value}' is invalid: this Node.js module does not exist`,
  reason: 'SCHEMA_SYNTAX_ERROR',
});

module.exports = {
  resolveRef,
};
