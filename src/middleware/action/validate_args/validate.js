'use strict';

const { addGenErrorHandler } = require('../../../errors');
const { compile, validate } = require('../../../validation');
const { getLimits } = require('../../../limits');

const SCHEMA = require('./args_schema');
const COMMANDS = require('./commands');

// Check arguments for client-side syntax errors.
const validateArgs = function ({ top: { args, command }, config }) {
  const data = getData({ args, command, config });

  eValidate({ compiledJsonSchema, data });
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

const getMessage = function (input, { message }) {
  const messageA = message.replace(ARGUMENTS_REGEXP, '\'$1\'');
  return `Wrong arguments: ${messageA}`;
};

// Matches 'arguments.ARG'
const ARGUMENTS_REGEXP = /^arguments.([^ ]+)/;

const eValidate = addGenErrorHandler(validate, {
  reason: 'INPUT_VALIDATION',
  message: getMessage,
});

module.exports = {
  validateArgs,
};
