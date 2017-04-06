'use strict';


const { merge, mapValues, chain } = require('lodash');

const { memoize, transform, validate } = require('../../utilities');
const { EngineError } = require('../../error');


/**
 * Check that input filter|data passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file, this will be validated here
 **/
const validateClientInputData = function ({ idl, modelName, operation, args }) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({ idl, modelName, operation, type });
  const data = getAttributes(args);
  validate({ schema, data, type });
};

/**
 * Check that output data passes IDL validation
 * If it does not, this probably indicates database corruption
 **/
const validateServerOutputData = function ({ idl, modelName, response, operation }) {
  const type = 'serverOutputData';
  const schema = getDataValidationSchema({ idl, modelName, operation, type });
  const data = response.map(response => ({ elem: response, extra: { argName: 'response' } }));
  validate({ schema, data, type });
};

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(function ({ idl, modelName, operation, type }) {
  // Deep copy
  const schema = merge({}, idl.models[modelName]);
  return transformSchema({ schema, operation, type });
});

// Adapt the IDL schema validation to the current operation, and to what the validator library expects
const transformSchema = function ({ schema, operation, type }) {
  // Apply each transform recursively
  return transform({
    transforms,
    args: { operation, type },
  })({ input: schema });
};

const optionalInputIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalInputAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const optionalOutputIdOperations = [];
const optionalOutputAttrOperations = ['deleteOne', 'deleteMany'];
const transforms = [
  {
    // Fix `required` attribute according to the current operation
    required({ value, operation, type }) {
      if (!(value instanceof Array)) { return; }

      if (type === 'clientInputData') {
        // Some operations do not require `id` nor `ids`  as input
        if (optionalInputIdOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp !== 'id');
        }
        // Some operations do not require normal attributes as input (except for `id` or `ids`)
        if (optionalInputAttrOperations.includes(operation)) {
          value = value.filter(requiredProp => requiredProp === 'id');
        }
      } else if (type === 'serverOutputData') {
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

/**
 * Transform arguments into model attributes to validate
 * E.g. args: { filters: { a: 1 }, data: [{ b: 2 }, {c: 5}], ids: [4,5] } would be transformed to:
 * [
 *   { a: 1, id: 4, argName: 'filters' },
 *   { a: 1, id: 5, argName: 'filters' },
 *   { b: 2, id: 4, argName: 'data' },
 *   { c: 5, id: 5, argName: 'data' },
 * ]
 **/
const getAttributes = function (args) {
  const { id, ids } = args;
  // Is either `id` or `ids` specified
  const hasIds = id || (ids && ids.length > 0);
  // If only `id` or `ids` is specified, transform to a `filters` with only `id` in it
  if (hasIds && !args.filters && !args.data) {
    args.filters = {};
  }
  // Iterate over args.filters and args.data
  return chain(args)
    .pickBy((arg, argName) => ['filters', 'data'].includes(argName) && arg)
    .map((arg, argName) => {
      if (ids) {
        // If `ids` is specified and `data` is an array, they must have same length
        if (arg instanceof Array) {
          if (arg.length !== ids.length) {
            throw new EngineError(`'${argName}' array length must match 'ids' array length`, { reason: 'INPUT_VALIDATION' });
          }
        // If `ids` is specified and `filters` or `data` is not an array, transform to an array of the same size
        } else {
          arg = Array(ids.length).fill(merge({}, arg));
        }
      }

      // Convenience for the next statements
      arg = arg instanceof Array ? arg : [arg];
      // Add `id` (from `id` or `ids` argument) to the `filters` and `data` objects
      if (hasIds) {
        arg = arg.map((singleArg, index) => Object.assign({}, singleArg, { id: id || ids[index] }));
      }
      // Add argument name (e.g. `filters` or `data`) so it can be used in errors messages
      arg = arg.map(elem => Object.assign({}, { elem }, { extra: { argName } }));
      return arg;
    })
    .flatten()
    .value();
};


module.exports = {
  validateClientInputData,
  validateServerOutputData,
};
