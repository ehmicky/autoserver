'use strict';

const { pickBy, mapValues, omit, memoize } = require('../../../utilities');

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({ idl, modelName, command }) {
  const model = idl.models[modelName];
  const modelA = fixRequired({ model, command });
  return modelA;
};

const mGetDataValidationSchema = memoize(getDataValidationSchema);

// Fix `required` attribute according to the current command.name
const fixRequired = function ({ model, command }) {
  const modelA = addJsonSchemaRequire({ model, command });
  const modelB = removeAttrRequire({ model: modelA });
  return modelB;
};

// JSON schema `require` attribute is a model-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function ({
  model,
  model: { properties },
  command,
}) {
  // Nothing is required for those command.name,
  // except maybe `id` (previously validated)
  if (optionalInputCommands.includes(command.name)) { return model; }

  const requiredProps = pickBy(properties,
    // `id` requiredness has already been checked by previous validator,
    // so we skip it here
    (attr, attrName) => attr.required === true && attrName !== 'id',
  );
  const required = Object.keys(requiredProps);
  return { ...model, required };
};

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];

const removeAttrRequire = function ({ model, model: { properties } }) {
  const propertiesA = mapValues(properties, prop => omit(prop, 'required'));
  return { ...model, properties: propertiesA };
};

module.exports = {
  getDataValidationSchema: mGetDataValidationSchema,
};
