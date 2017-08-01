'use strict';

const { pickBy, mapValues, omit, memoize } = require('../../../utilities');

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({ idl, modelName, command }) {
  const model = idl.models[modelName];
  const modelA = addJsonSchemaRequire({ model, command });
  const modelB = addJsonSchemaDeps({ model: modelA });
  const modelC = removeAltSyntax({ model: modelB });
  return modelC;
};

const mGetDataValidationSchema = memoize(getDataValidationSchema);

// Fix `required` attribute according to the current command.name
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
    (attr, attrName) => attr.validate.required === true && attrName !== 'id',
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

// JSON schema `dependencies` attribute is model-level, not attribute-level
const addJsonSchemaDeps = function ({ model, model: { properties } }) {
  const dependencies = mapValues(
    properties,
    ({ validate }) => validate.dependencies,
  );
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...model, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function ({ model, model: { properties } }) {
  const propertiesA = mapValues(properties, prop => {
    const validate = omit(prop.validate, nonJsonSchemaAttrs);
    return { ...prop, validate };
  });
  return { ...model, properties: propertiesA };
};

const nonJsonSchemaAttrs = [
  'required',
  'dependencies',
];

module.exports = {
  getDataValidationSchema: mGetDataValidationSchema,
};
