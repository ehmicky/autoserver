'use strict';


const { each } = require('lodash');

const { EngineError } = require('../../error');


/**
 * There should be no circular references.
 * They may be introduced by e.g. dereferencing JSON references `$ref` or YAML anchors `*var`
 * The only legal way to introduce circular references is by using `model` property, which is dereferenced later.
 **/
const validateCircularRefs = function ({ value, path = 'schema', pathSet = new WeakSet() }) {
  if (pathSet.has(value)) {
    throw new EngineError(`Schema cannot contain circular references: ${path}`, { reason: 'IDL_VALIDATION' });
  }
  if (typeof value === 'object' && value) {
    pathSet.add(value);
  }

  // Recursion
  if (value && (value instanceof Array || value.constructor === Object)) {
    each(value, (child, childKey) => {
      const pathPart = value instanceof Array ? `[${childKey}]` : `.${childKey}`;
      const childPath = `${path}${pathPart}`;
      validateCircularRefs({ value: child, path: childPath, pathSet });
    });
  }

  pathSet.delete(value);
};


module.exports = {
  validateCircularRefs,
};
