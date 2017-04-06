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

// Adapt the IDL schema validation to the current operation, and to what the validator library expects
const transformSchema = function ({ schema, operation, direction }) {
  // Apply each transform recursively
  return transform({
    transforms,
    args: { operation, direction },
  })({ input: schema });
};

const optionalInputIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalInputAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const optionalOutputIdOperations = [];
const optionalOutputAttrOperations = ['deleteOne', 'deleteMany'];
const transforms = [
  {
    // Fix `required` attribute according to the current operation
    required({ value, operation, direction }) {
      if (!(value instanceof Array)) { return; }

      if (direction === 'input') {
        // Some operations do not require `id` nor `ids`  as input
        if (optionalInputIdOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp !== 'id');
        }
        // Some operations do not require normal attributes as input (except for `id` or `ids`)
        if (optionalInputAttrOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp === 'id');
        }
      } else if (direction === 'output') {
        // Some operations might not require `id` nor `ids`  as output (for the moment, none)
        if (optionalOutputIdOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp !== 'id');
        }
        // Some operations do not require normal attributes as output (except for `id` or `ids`)
        if (optionalOutputAttrOperations.includes(operation)) {
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
