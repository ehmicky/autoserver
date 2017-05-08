'use strict';


const { cloneDeep, mapValues, pickBy, each } = require('lodash');

const { memoize, transform, validate } = require('../../utilities');


/**
 * Check that input filter|data passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file, this will be validated here
 **/
const validateClientInputData = function ({ idl, modelName, action, args, extra }) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({ idl, modelName, action, type });
  const attributes = getAttributes(args);
  each(attributes, (attribute, dataVar) => {
    attribute = attribute instanceof Array ? attribute : [attribute];
    attribute.forEach(data => {
      data = cloneDeep(data);
      removeJsl({ value: data });
      validate({ schema, data, reportInfo: { type, modelName, action, dataVar }, extra });
    });
  });
};

// Do not validate JSL code
// TODO: remove when using MongoDB query objects
const removeJsl = function ({ value, parent, key }) {
  if (!value) { return; }

  if (typeof value === 'function' && parent) {
    if (parent instanceof Array) {
      parent.splice(key, 1);
    } else if (parent.constructor === Object) {
      delete parent[key];
    }
    return;
  }

  // Recursion
  if (value instanceof Array || value.constructor === Object) {
    each(value, (child, key) => removeJsl({ value: child, parent: value, key }));
  }
};

/**
 * Check that output data passes IDL validation
 * If it does not, this probably indicates database corruption
 **/
const validateServerOutputData = function ({ idl, modelName, response: { data }, action, extra }) {
  const type = 'serverOutputData';
  const schema = getDataValidationSchema({ idl, modelName, action, type });
  data = data instanceof Array ? data : [data];
  data.forEach(datum => {
    validate({ schema, data: datum, reportInfo: { type, modelName, action, dataVar: 'response' }, extra });
  });
};

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(function ({ idl, modelName, action, type }) {
  const schema = cloneDeep(idl.models[modelName]);
  // Adapt the IDL schema validation to the current action, and to what the validator library expects
  // Apply each transform recursively
  transform({ transforms, args: { action, type } })({ input: schema });
  return schema;
});

const optionalInputAttrActions = ['findOne', 'findMany', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany'];
const optionalOutputAttrActions = ['deleteOne', 'deleteMany'];
const transforms = [
  {
    // Fix `required` attribute according to the current action
    required({ value: required, action, type }) {
      if (!(required instanceof Array)) { return; }

      if (type === 'clientInputData') {
        // Nothing is required for those actions, except maybe `id` (previously validated)
        if (optionalInputAttrActions.includes(action)) {
          required = [];
        // `id` requiredness has already been checked by previous validator, so we skip it here
        } else {
          required = required.filter(requiredProp => requiredProp !== 'id');
        }
      } else if (type === 'serverOutputData') {
        // Some actions do not require normal attributes as output (except for `id`)
        if (optionalOutputAttrActions.includes(action)) {
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
