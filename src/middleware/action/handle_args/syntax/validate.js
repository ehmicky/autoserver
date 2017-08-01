'use strict';

const { pick, omit, mapKeys, mapValues } = require('../../../../utilities');
const { validate } = require('../../../../validation');

const { actionsArgs } = require('./actions');
const { commonSchema, argsSchema } = require('./schemas');

/**
 * Check arguments, for client-side errors.
 * In a nutshell, checks that:
 *  - required arguments are defined
 *  - disabled or unknown arguments are not defined
 *  - arguments that are defined follow correct syntax
 *    Does not check for semantics (e.g. IDL validation)
 **/
const validateSyntax = function ({ args, action }) {
  const schema = actionSchemas[action.name];
  validate({ schema, data: args, reportInfo: { type, dataVar: 'args' } });
};

const type = 'clientInputSyntax';

const getActionSchema = function ({ optional = [], required = [] }) {
  const optionalProps = pick(argsSchema, [...optional, ...required]);
  const mappedProps = mapKeys(optionalProps, ({ name }, key) => name || key);
  const requiredProps = required.map(name => argsSchema[name].name || name);
  const properties = mapValues(mappedProps, value => omit(value, 'name'));

  return { properties, required: requiredProps, ...commonSchema };
};

// JSON schemas validating `args` for each action
const actionSchemas = mapValues(actionsArgs, args => getActionSchema(args));

module.exports = {
  validateSyntax,
};
