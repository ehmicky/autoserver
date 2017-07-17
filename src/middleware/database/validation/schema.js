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
    required ({ value: required, command, type }) {
      if (!Array.isArray(required)) { return; }

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
    model ({ parent, depth }) {
      if (depth === 0) { return; }
      const idProp = parent.properties.id;
      const removeParentProps = mapValues(parent, () => undefined);
      return Object.assign(removeParentProps, idProp);
    },
  },
];

module.exports = {
  getDataValidationSchema,
};
