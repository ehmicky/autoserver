'use strict';

const { COMMANDS } = require('../../constants');
const { omit, mapValues, assignObject } = require('../../utilities');
const { compile } = require('../../json_validation');

// Compile JSON schema defined in IDL file
const compileJsonSchema = function ({
  idl,
  idl: { shortcuts, shortcuts: { validateMap } },
}) {
  const validateMapA = mapValues(
    validateMap,
    compileSchemaByModel.bind(null, { idl }),
  );
  return {
    idl: {
      ...idl,
      shortcuts: { ...shortcuts, validateMap: validateMapA },
    },
  };
};

const compileSchemaByModel = function ({ idl }, schema) {
  return COMMANDS
    .map(compileSchemaByCommand.bind(null, { schema, idl }))
    .reduce(assignObject, {});
};

const compileSchemaByCommand = function ({ idl, schema }, command) {
  const schemaA = removeRequire({ schema, command });
  const compiledSchema = compile({ idl, schema: schemaA });
  return { [command]: compiledSchema };
};

// Nothing is required for find|delete, except maybe `id` (previously validated)
const removeRequire = function ({ schema, command }) {
  if (!optionalInputCommands.includes(command)) { return schema; }

  return omit(schema, 'required');
};

const optionalInputCommands = ['find', 'delete'];

module.exports = {
  compileJsonSchema,
};
