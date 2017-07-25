'use strict';

const { EngineError } = require('../../error');

/**
 * There should be no circular references.
 * They may be introduced by e.g. dereferencing JSON references `$ref`
 * or YAML anchors `*var`
 * The only legal way to introduce circular references is by using
 * `model` property, which is dereferenced later.
 **/
const validateIdlCircularRefs = function (idl) {
  return validateCircularRefs({ value: idl });
};

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

  walkCircularRefs({ value, path, pathSet });

  pathSet.delete(value);

  return value;
};

// Recursion
const walkCircularRefs = function ({ value, path, pathSet }) {
  if (!value) { return; }
  if (!Array.isArray(value) && value.constructor !== Object) { return; }

  for (const [childKey, child] of Object.entries(value)) {
    const childPath = Array.isArray(value)
      ? `${path}[${childKey}]`
      : `${path}.${childKey}`;
    validateCircularRefs({ value: child, path: childPath, pathSet });
  }
};

module.exports = {
  validateIdlCircularRefs,
};
