'use strict';


const { merge, mapValues } = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties', ]);

const { memoize, transform } = require('../../utilities');


// Retrieves validator function
const getValidator = memoize(function ({ idl, modelName, operation, direction }) {
  let schema = idl.models[modelName];
  // Deep copy
  schema = merge({}, schema);
  schema = transformSchema({ schema, operation, direction });
  const validator = ajv.compile(schema);
  return validator;
});

/*
  TODO:
    - always require `id[s]` on return value (should be done by default)
    - do not require any other attribute but `id[s]` on 'delete*' return value
    - improve error messages, testing each validation function
    - try to use depthType in GraphQL layer, or the fact that the referred instance's id type is directly available recursively
*/
// Adapt the IDL schema validation to the current operation, and to what the validator library expects
const optionalIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const transformSchema = function ({ schema, operation, direction }) {
  // Apply each transform recursively
  return transform({
    transforms,
    args: () => ({ operation, direction }),
  })({ input: schema });
};

const transforms = [
  {
    // Fix `required` attribute according to the current operation
    required({ value, operation, direction }) {
      if (!(value instanceof Array)) { return; }

      if (direction === 'input') {
        // Some operations do not require `id` nor `ids`
        if (optionalIdOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp !== 'id');
        }
        // Some operations do not require normal attributes (except for `id` or `ids`)
        if (optionalAttrOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp === 'id');
        }
      }

      return { required: value };
    },

    // Submodels should be validated against the model `id` attribute
    // By default, in the IDL, they are represented as the full model, i.e. as an object
    instanceof({ parent }) {
      if (parent.depthType === 'model' || !parent.properties) { return; }
      const idProp = parent.properties.id;
      const removeParentProps = mapValues(parent, () => undefined);
      return Object.assign(removeParentProps, idProp);
    },
  },
];

module.exports = {
  getValidator,
};
