'use strict';

const { compile, validate } = require('../../../validation');
const { getLimits } = require('../../../limits');

const SCHEMA = require('./args_schema');
const COMMANDS = require('./commands');

// Check arguments for client-side syntax errors.
const validateArgs = function ({ top: { args, command }, config }) {
  const data = getData({ args, command, config });

  validate({
    compiledJsonSchema,
    data,
    reason: 'INPUT_VALIDATION',
    message: 'Wrong arguments',
  });
};

const compiledJsonSchema = compile({ jsonSchema: SCHEMA });

const getData = function ({ args, command, config }) {
  const dynamicVars = getDynamicArgs({ command, config });
  return { arguments: args, dynamicVars };
};

const getDynamicArgs = function ({ command, command: { multiple }, config }) {
  const { required, optional } = COMMANDS[command.name];
  const validArgs = [...required, ...optional];
  const { pagesize } = getLimits({ config });

  return { multiple, requiredArgs: required, validArgs, pagesize };
};

module.exports = {
  validateArgs,
};
