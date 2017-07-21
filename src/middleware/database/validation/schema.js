'use strict';

const { cloneDeep } = require('lodash');

const { memoize, transform, mapValues } = require('../../../utilities');

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(({
  idl,
  modelName,
  command,
  type,
}) => {
  const schema = cloneDeep(idl.models[modelName]);
  // Adapt the IDL schema validation to the current command.name,
  // and to what the validator library expects
  // Apply each transform recursively
  transform({ transforms, args: { command, type } })({ input: schema });
  return schema;
});

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];
const optionalOutputCommands = [
  'deleteOne',
  'deleteMany',
];
const transforms = [
  {
    // Fix `required` attribute according to the current command.name
    required ({ value, command, type }) {
      if (!Array.isArray(value)) { return; }

      const requiredFunc = getRequiredFunc({ type });
      const required = requiredFunc({ value, command });
      return { required };
    },
  },

  {
    // Submodels should be validated against the model `id` attribute
    // By default, in the IDL, they are represented as the full model,
    // i.e. as an object
    model ({ parent, depth }) {
      if (depth === 0) { return; }
      const idProp = parent.properties.id;
      const removeParentProps = mapValues(parent, () => undefined);
      return Object.assign(removeParentProps, idProp);
    },
  },
];

const getRequiredFunc = function ({ type }) {
  if (type === 'clientInputData') { return getClientInputRequired; }
  if (type === 'serverOutputData') { return getServerOutputRequired; }
  return getOtherRequired;
};

const getClientInputRequired = function ({ value, command }) {
  // Nothing is required for those command.name,
  // except maybe `id` (previously validated)
  if (optionalInputCommands.includes(command.name)) { return []; }

  // `id` requiredness has already been checked by previous validator,
  // so we skip it here
  return value.filter(requiredProp => requiredProp !== 'id');
};

const getServerOutputRequired = function ({ value, command }) {
  // Some command.name do not require normal attributes as output
  // (except for `id`)
  if (optionalOutputCommands.includes(command.name)) {
    return value.filter(requiredProp => requiredProp === 'id');
  }

  return value;
};

const getOtherRequired = function ({ value }) {
  return value;
};

module.exports = {
  getDataValidationSchema,
};
