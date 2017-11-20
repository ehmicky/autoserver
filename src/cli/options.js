'use strict';

const { dasherize } = require('underscore.string');

// Retrieve CLI options from `instruction`
const getCliOptions = function ({ instruction: { options } }) {
  const cliOptions = options.map(getCliOption);
  const cliOptionsA = Object.assign({}, ...cliOptions);
  return cliOptionsA;
};

// Map from `availableOptions` types and yargs types
const CLI_TYPES = {
  string: 'string',
  integer: 'number',
  number: 'number',
  boolean: 'boolean',
  bytes: 'string',
  // eslint-disable-next-line quote-props
  'function': 'string',
  object: '',
  'string[]': 'array',
  'integer[]': 'array',
  'number[]': 'array',
  'boolean[]': 'array',
  'function[]': 'array',
  'object[]': '',
};

const getType = function ({ subConfFiles, validate: { type } = {} }) {
  if (subConfFiles) { return 'string'; }

  const typeA = Array.isArray(type) ? type[0] : type;
  return CLI_TYPES[typeA];
};

const getCliOption = function (option) {
  const { name } = option;
  const nameA = dasherize(name);

  const cliOption = cliOptionsParams.map(func => func(option));
  const cliOptionA = Object.assign({}, ...cliOption);

  return { [nameA]: cliOptionA };
};

// Option type, for parsing and --help message
const getCliType = function (option) {
  const type = getType(option);
  return { type };
};

// Option possible values, for validation and --help message
const getChoices = function ({ validate: { enum: choices } = {} }) {
  if (!choices) { return {}; }

  return { choices };
};

// Option group, for --help message
const getGroup = function ({ group }) {
  if (!group) { return { group: 'Options:' }; }

  return { group: `${group}:` };
};

// Option description, for --help message
const getDescription = function ({ description = ' ' }) {
  return { describe: description };
};

// Arrays get any number of arguments. Booleans none. All others one.
const getNargs = function (option) {
  const type = getType(option);
  if (type === 'boolean') { return { nargs: 0 }; }

  if (type !== 'array') { return { nargs: 1 }; }

  return {};
};

// All options requires an argument, except booleans
const getRequiresArg = function (option) {
  const type = getType(option);
  const requiresArg = type === 'boolean';
  return { requiresArg };
};

// We reset default values, because we want to do this later,
// not during CLI parsing
const getDefault = function (option) {
  const type = getType(option);
  if (type !== 'boolean') { return {}; }

  return { default: undefined };
};

const cliOptionsParams = [
  getCliType,
  getChoices,
  getGroup,
  getDescription,
  getNargs,
  getRequiresArg,
  getDefault,
];

module.exports = {
  getCliOptions,
};
