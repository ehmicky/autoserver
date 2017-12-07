'use strict';

const { mapValues } = require('../../../utilities');
const { throwError } = require('../../../error');

// There should be no circular references.
// They may be introduced by e.g. dereferencing JSON references `$ref`
// or YAML anchors `*var`
const validateCircularRefs = function ({ schema }) {
  validateCircRefs(schema);

  return schema;
};

const validateCircRefs = function (
  value,
  {
    path = 'schema',
    pathSet = new WeakSet(),
  } = {},
) {
  if (pathSet.has(value)) {
    const message = `The schema cannot contain circular references: '${path}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (!value) { return; }
  if (!Array.isArray(value) && value.constructor !== Object) { return; }

  walkCircularRefs(value, { path, pathSet });
};

const walkCircularRefs = function (value, { path, pathSet }) {
  pathSet.add(value);

  const iterator = Array.isArray(value)
    ? value.map.bind(value)
    : mapValues.bind(null, value);
  iterator((child, childKey) => {
    const childPath = Array.isArray(value)
      ? `${path}[${childKey}]`
      : `${path}.${childKey}`;
    validateCircRefs(child, { path: childPath, pathSet });
  });

  pathSet.delete(value);
};

module.exports = {
  validateCircularRefs,
};
