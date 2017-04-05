'use strict';


const { merge } = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties', ]);

const { memoize, recurseMap } = require('../../utilities');


// Retrieves validator function
const getValidator = memoize(function ({ idl, modelName, operation }) {
  let schema = idl.models[modelName];
  // Deep copy
  schema = merge({}, schema);
  schema = transformSchema({ schema, operation });
  const validator = ajv.compile(schema);
  return validator;
});

/*
  TODO:
    - validate return value as well
    - always require `id[s]` on return value (should be done by default)
    - do not require any other attribute but `id[s]` on 'delete*' return value
    - improve error messages, testing each validation function
*/
// Adapt the IDL schema validation to the current operation, and to what the validator library expects
const optionalIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const transformSchema = function ({ schema, operation }) {
  // Apply each transform recursively
  return recurseMap(schema, (value, key) => transforms[key] ? transforms[key]({ value, operation }) : value);
};

// Applied on the schema, where the key is the attribute of the value to transform
const transforms = {
  required({ value, operation }) {
    if (!value instanceof Array) { return value; }

    // Some operations do not require `id` nor `ids`
    if (optionalIdOperations.includes(operation)) {
      value = value.filter(requiredProp => requiredProp !== 'id');
    }
    // Some operations do not require normal attributes (except for `id` or `ids`)
    if (optionalAttrOperations.includes(operation)) {
      value = value.filter(requiredProp => requiredProp === 'id');
    }

    return value;
  },
};

module.exports = {
  getValidator,
};
