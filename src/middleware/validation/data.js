'use strict';


const { merge, mapValues, pickBy, each } = require('lodash');

const { memoize, transform, validate } = require('../../utilities');


/**
 * Check that input filter|data passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file, this will be validated here
 **/
const validateClientInputData = function ({ idl, modelName, operation, args }) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({ idl, modelName, operation, type });
  const attributes = getAttributes(args);
  each(attributes, (attribute, dataVar) => {
    attribute = attribute instanceof Array ? attribute : [attribute];
    attribute.forEach(data => {
      validate({ schema, data, reportInfo: { type, modelName, operation, dataVar } });
    });
  });
};

/**
 * Check that output data passes IDL validation
 * If it does not, this probably indicates database corruption
 **/
const validateServerOutputData = function ({ idl, modelName, response, operation }) {
  const type = 'serverOutputData';
  const schema = getDataValidationSchema({ idl, modelName, operation, type });
  response = response instanceof Array ? response : [response];
  response.forEach(data => {
    validate({ schema, data, reportInfo: { type, modelName, operation, dataVar: 'response' } });
  });
};

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(function ({ idl, modelName, operation, type }) {
  // Deep copy
  const schema = merge({}, idl.models[modelName]);
  // Adapt the IDL schema validation to the current operation, and to what the validator library expects
  // Apply each transform recursively
  transform({ transforms, args: { operation, type } })({ input: schema });
  return schema;
});

const optionalInputAttrOperations = ['findOne', 'findMany', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany'];
const multipleIdInputOperations = ['findMany', 'deleteMany', 'updateMany'];
const optionalOutputAttrOperations = ['deleteOne', 'deleteMany'];
const transforms = [
  {
    // Fix `required` attribute according to the current operation
    required({ value: required, operation, type }) {
      if (!(required instanceof Array)) { return; }

      if (type === 'clientInputData') {
        // Nothing is required for those operations, except maybe `id` (previously validated)
        if (optionalInputAttrOperations.includes(operation)) {
          required = [];
        // `id` requiredness has already been checked by previous validator, so we skip it here
        } else {
          required = required.filter(requiredProp => requiredProp !== 'id');
        }
      } else if (type === 'serverOutputData') {
        // Some operations do not require normal attributes as output (except for `id`)
        if (optionalOutputAttrOperations.includes(operation)) {
          required = required.filter(requiredProp => requiredProp === 'id');
        }
      }

      return { required };
    },
  },

  {
    // Submodels should be validated against the model `id` attribute
    // By default, in the IDL, they are represented as the full model, i.e. as an object
    model({ parent, depth }) {
      if (depth === 0) { return; }
      const idProp = parent.properties.id;
      const removeParentProps = mapValues(parent, () => undefined);
      return Object.assign(removeParentProps, idProp);
    },
  },

  {
    // Some operations require filter.id to be an array
    id({ value, operation, type }) {
      if (!(type === 'clientInputData' && multipleIdInputOperations.includes(operation))) { return; }
      return { id: { type: 'array', items: value } };
    },
  },
];

/**
 * Keeps the arguments to validate
 **/
const getAttributes = function (args) {
  return pickBy(args, (arg, dataVar) => ['filter', 'data'].includes(dataVar) && arg);
};


module.exports = {
  validateClientInputData,
  validateServerOutputData,
};
