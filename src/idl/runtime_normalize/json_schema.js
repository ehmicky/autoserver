'use strict';

const { COMMAND_TYPES } = require('../../constants');
const { omit, mapValues, assignObject } = require('../../utilities');
const { compile } = require('../../json_validation');

// Compile JSON schema defined in IDL file
const compileJsonSchema = function ({
  idl,
  idl: { shortcuts, shortcuts: { validateMap } },
}) {
  const validateMapA = mapValues(
    validateMap,
    compileJsonSchemaByModel.bind(null, { idl }),
  );
  return {
    idl: {
      ...idl,
      shortcuts: { ...shortcuts, validateMap: validateMapA },
    },
  };
};

const compileJsonSchemaByModel = function ({ idl }, jsonSchema) {
  return COMMAND_TYPES
    .map(compileJsonSchemaCommand.bind(null, { jsonSchema, idl }))
    .reduce(assignObject, {});
};

const compileJsonSchemaCommand = function ({ idl, jsonSchema }, command) {
  const jsonSchemaA = removeRequire({ jsonSchema, command });
  const compiledJsonSchema = compile({ idl, jsonSchema: jsonSchemaA });
  return { [command]: compiledJsonSchema };
};

// Nothing is required for find|delete, except maybe `id` (previously validated)
const removeRequire = function ({ jsonSchema, command }) {
  if (!optionalInputCommands.includes(command)) { return jsonSchema; }

  return omit(jsonSchema, 'required');
};

const optionalInputCommands = ['find', 'delete'];

module.exports = {
  compileJsonSchema,
};
