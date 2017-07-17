'use strict';

const { EngineError } = require('../../error');

/**
 * There should be no circular references.
 * They may be introduced by e.g. dereferencing JSON references `$ref`
 * or YAML anchors `*var`
 * The only legal way to introduce circular references is by using
 * `model` property, which is dereferenced later.
 **/
const validateCircularRefs = function ({
  value,
  path = 'schema',
  pathSet = new WeakSet(),
}) {
  if (pathSet.has(value)) {
    const message = `Schema cannot contain circular references: ${path}`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  if (typeof value === 'object' && value) {
    pathSet.add(value);
  }

  // Recursion
  if (value && (value instanceof Array || value.constructor === Object)) {
    for (const [childKey, child] of Object.entries(value)) {
      const pathPart = value instanceof Array
        ? `[${childKey}]`
        : `.${childKey}`;
      const childPath = `${path}${pathPart}`;
      validateCircularRefs({ value: child, path: childPath, pathSet });
    }
  }

  pathSet.delete(value);
};

module.exports = {
  validateCircularRefs,
};
