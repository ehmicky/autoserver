'use strict';

const { omit } = require('../../../utilities');

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({
  idl: { shortcuts: { validateMap } },
  modelName,
  command,
}) {
  const schema = validateMap[modelName];

  const schemaA = removeRequire({ schema, command });
  return schemaA;
};

// Nothing is required for read|delete, except maybe `id` (previously validated)
const removeRequire = function ({ schema, command }) {
  if (!optionalInputCommands.includes(command.name)) { return schema; }

  return omit(schema, 'required');
};

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];

module.exports = {
  getDataValidationSchema,
};
