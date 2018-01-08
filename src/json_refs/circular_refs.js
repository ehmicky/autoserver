'use strict';

const { throwError } = require('../errors');

// When encountering the same JSON reference twice, do not resolve the second
// one. This is done to fix recursion problems. Those JSON references are
// resolve later.
const fireCachedFunc = function (func, { path, cache, stack }) {
  if (cache[path] !== undefined) { return cache[path]; }

  const stackA = validateRecursion({ path, stack });

  const content = func({ path, cache, stack: stackA });

  // Indicates the JSON reference is now resolved
  // `content` might be a promise
  // We directly mutate so that siblings can share the same `cache`
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  cache[path] = content;

  return content;
};

const validateRecursion = function ({ path, stack }) {
  if (!stack.includes(path)) {
    return [...stack, path];
  }

  const message = `The configuration cannot contain circular references: '${path}'`;
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

module.exports = {
  fireCachedFunc,
  validateRecursion,
};
