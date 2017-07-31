'use strict';

const { throwError } = require('../../error');
const { mapValues } = require('../../utilities');

/**
 * There should be no circular references.
 * They may be introduced by e.g. dereferencing JSON references `$ref`
 * or YAML anchors `*var`
 **/
const validateIdlCircularRefs = function (idl) {
  return validateCircularRefs(idl);
};

const validateCircularRefs = function (value, {
  path = 'schema',
  pathSet = new WeakSet(),
} = {}) {
  if (pathSet.has(value)) {
    const message = `Schema cannot contain circular references: ${path}`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (!value) { return value; }
  if (!Array.isArray(value) && value.constructor !== Object) { return value; }

  return walkCircularRefs(value, { path, pathSet });
};

const walkCircularRefs = function (value, { path, pathSet }) {
  pathSet.add(value);

  const iterator = Array.isArray(value)
    ? value.map.bind(value)
    : mapValues.bind(null, value);
  const valueA = iterator((child, childKey) => {
    const childPath = Array.isArray(value)
      ? `${path}[${childKey}]`
      : `${path}.${childKey}`;
    return validateCircularRefs(child, { path: childPath, pathSet });
  });

  pathSet.delete(value);

  return valueA;
};

module.exports = {
  validateIdlCircularRefs,
};
