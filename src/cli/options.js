'use strict';

const { dasherize } = require('underscore.string');

const { assignObject } = require('../utilities');

// Retrieve CLI options from `instruction`
const getCliOptions = function ({ instruction: { options } }) {
  return options
    .map(getCliOption)
    .reduce(assignObject, {});
};

// Map from `availableOptions` types and yargs types
const cliTypes = {
  string: 'string',
  integer: 'number',
  number: 'number',
  boolean: 'boolean',
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
  return cliTypes[typeA];
};

const getCliOption = function (option) {
  const cliOption = cliOptionsParams
    .map(func => func(option))
    .reduce(assignObject, {});
  const name = dasherize(option.name);
  return { [name]: cliOption };
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
