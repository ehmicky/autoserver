'use strict';

const { COMMAND_TYPES } = require('../../constants');
const { omit, mapValues, assignObject } = require('../../utilities');
const { compile } = require('../../json_validation');

// Compile JSON schema defined in the schema
const compileJsonSchema = function ({
  schema,
  schema: { shortcuts, shortcuts: { validateMap } },
}) {
  const validateMapA = mapValues(
    validateMap,
    compileJsonSchemaByModel.bind(null, { schema }),
  );
  return {
    schema: {
      ...schema,
      shortcuts: { ...shortcuts, validateMap: validateMapA },
    },
  };
};

const compileJsonSchemaByModel = function ({ schema }, jsonSchema) {
  return COMMAND_TYPES
    .map(compileJsonSchemaCommand.bind(null, { jsonSchema, schema }))
    .reduce(assignObject, {});
};

const compileJsonSchemaCommand = function ({ schema, jsonSchema }, command) {
  const jsonSchemaA = removeRequire({ jsonSchema, command });
  const compiledJsonSchema = compile({ schema, jsonSchema: jsonSchemaA });
  return { [command]: compiledJsonSchema };
};

// Nothing is required for find|delete, except maybe `id` (previously validated)
const removeRequire = function ({ jsonSchema, command }) {
  if (!OPTIONAL_INPUT_COMMANDS.includes(command)) { return jsonSchema; }

  return omit(jsonSchema, 'required');
};

const OPTIONAL_INPUT_COMMANDS = ['find', 'delete'];

module.exports = {
  compileJsonSchema,
};
