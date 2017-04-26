'use strict';


const { each, merge, isEqual } = require('lodash');

const { EngineError } = require('../../error');
const { transformInput, transformOutput } = require('./transformer');


// Checks that transform are idempotent
// I.e. when transform[Out] is applied twice, it should return same result as when applied once
// The reason is: transforms are meant to bring the value to a 'stable' state, not to augment it. Otherwise, it would
// break basic CRUD semantics clients expect when it comes to request idempotency.
// Can be turned off using `attribute.idempotent` false in IDL file
// TODO: do this during IDL validation instead.
const checkIdempotency = function ({ value, transformArgs, modelName, propsIdl = {} }) {
  value = value instanceof Array ? value : [value];
  const beforeInput = value.map(val => merge({}, val));
  const afterInput = transformInput(Object.assign({ value: beforeInput }, transformArgs));
  const afterOutput = transformOutput(Object.assign({ value: afterInput }, transformArgs));
  value.forEach((val, key) => {
    each(val, (attr, attrName) => {
      // Do not perform this check if schema.idempotent is false or if schema.writeOnce is true
      const propIdl = propsIdl[attrName];
      if (propIdl && (propIdl.idempotent === false || propIdl.writeOnce)) { return; }

      const afterAttr = afterOutput[key][attrName];
      if (!isEqual(attr, afterAttr)) {
        throw new EngineError(`${modelName}.${attrName} transform is not idempotent, \
as resubmitting value '${attr}' would change it to '${afterAttr}'`, { reason: 'TRANSFORM_IDEMPOTENCY' });
      }
    });
  });
};


module.exports = {
  checkIdempotency,
};
