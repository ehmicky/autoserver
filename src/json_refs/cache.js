'use strict';

const { throwError } = require('../error');

// Handles recursive references
const cachedDereference = function ({
  path,
  refPath,
  cache = {},
  dereferenceRefs,
  ...rest
}) {
  if (cache[path]) {
    const message = `The schema cannot contain circular JSON references: '${refPath}'`;
    throwError(message, { reason: 'SCHEMA_SYNTAX_ERROR' });
  }

  const cacheA = { ...cache, [path]: true };

  return dereferenceRefs({ path, refPath, cache: cacheA, ...rest });
};

module.exports = {
  cachedDereference,
};
