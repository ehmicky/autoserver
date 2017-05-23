'use strict';


const { cloneDeep, mapValues, pickBy, each } = require('lodash');

const { memoize, transform } = require('../../../utilities');
const { validate } = require('../../../validation');


/**
 * Check that input filter|data passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
 * this will be validated here
 **/
const validateClientInputData = function ({
  idl,
  modelName,
  command,
  dbArgs,
  jsl,
}) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({
    idl,
    modelName,
    command,
    type,
  });
  const attributes = getAttributes(dbArgs);
  each(attributes, (attribute, dataVar) => {
    attribute = attribute instanceof Array ? attribute : [attribute];
    attribute.forEach(data => {
      data = cloneDeep(data);
      removeJsl({ value: data });
      const reportInfo = { type, dataVar };
      validate({ schema, data, reportInfo, extra: jsl });
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
    each(value, (child, key) => {
      return removeJsl({ value: child, parent: value, key });
    });
  }
};

/**
 * Check that output data passes IDL validation
 * If it does not, this probably indicates database corruption
 **/
const validateServerOutputData = function ({
  idl,
  modelName,
  response: { data },
  action,
  command,
  dbArgs: { no_output: noOutput },
  jsl,
}) {
  if (noOutput) { return; }

  const type = 'serverOutputData';
  const schema = getDataValidationSchema({ idl, modelName, command, type });
  data = data instanceof Array ? data : [data];
  data.forEach(datum => {
    const reportInfo = { type, modelName, action, dataVar: 'response' };
    validate({ schema, data: datum, reportInfo, extra: jsl });
  });
};

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(function ({
  idl,
  modelName,
  command,
  type,
}) {
  const schema = cloneDeep(idl.models[modelName]);
  // Adapt the IDL schema validation to the current command.name,
  // and to what the validator library expects
  // Apply each transform recursively
  transform({ transforms, args: { command, type } })({ input: schema });
  return schema;
});

const optionalInputAttrCommandNames = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];
const optionalOutputAttrCommandNames = [
  'deleteOne',
  'deleteMany',
];
const transforms = [
  {
    // Fix `required` attribute according to the current command.name
    required({ value: required, command, type }) {
      if (!(required instanceof Array)) { return; }

      if (type === 'clientInputData') {
        // Nothing is required for those command.name,
        // except maybe `id` (previously validated)
        if (optionalInputAttrCommandNames.includes(command.name)) {
          required = [];
        // `id` requiredness has already been checked by previous validator,
        // so we skip it here
        } else {
          required = required.filter(requiredProp => requiredProp !== 'id');
        }
      } else if (type === 'serverOutputData') {
        // Some command.name do not require normal attributes as output
        // (except for `id`)
        if (optionalOutputAttrCommandNames.includes(command.name)) {
          required = required.filter(requiredProp => requiredProp === 'id');
        }
      }

      return { required };
    },
  },

  {
    // Submodels should be validated against the model `id` attribute
    // By default, in the IDL, they are represented as the full model,
    // i.e. as an object
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
const getAttributes = function (dbArgs) {
  // TODO: validate `filter`
  return pickBy(dbArgs, (arg, dataVar) => {
    return [/*'filter', */'data'].includes(dataVar) && arg;
  });
};


module.exports = {
  validateClientInputData,
  validateServerOutputData,
};
