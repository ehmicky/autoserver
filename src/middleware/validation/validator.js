'use strict';


const { merge } = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties', ]);

const { memoize } = require('../../utilities');


// Retrieves validator function
const getValidator = memoize(function ({ idl, modelName, operation }) {
  const schema = idl.models[modelName];
  const transformedSchema = transformSchema({ schema, operation });
  const validator = ajv.compile(transformedSchema);
  return validator;
});

/*
REQUIRE:
Use schema.yml require array except:
  data.id[s]: only update|replace|upsert or findOne|deleteOne
  data.ATTR: only create|replace|upsert
  return.id[s]: always
  return.ATTR: not delete
*/
// Adapt the IDL schema validation to the current operation, and to what the validator library expects
const optionalIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const transformSchema = function ({ schema, operation }) {
  // Deep copy
  schema = merge({}, schema);

  if (schema.required instanceof Array) {
    // Some operations do not require `id`
    if (optionalIdOperations.includes(operation)) {
      schema.required = schema.required.filter(requiredProp => requiredProp !== 'id');
    }
    // Some operations do not require normal attributes (except for `id`)
    if (optionalAttrOperations.includes(operation)) {
      schema.required = schema.required.filter(requiredProp => requiredProp === 'id');
    }
  }

  return schema;
};

module.exports = {
  getValidator,
};
