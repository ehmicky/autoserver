'use strict';

const { pick, omit, mapKeys, mapValues } = require('../../../../utilities');
const { validate } = require('../../../../validation');

const { actionsArgs } = require('./actions');
const { commonSchema, argsSchema } = require('./schemas');

// Check arguments, for client-side errors.
// In a nutshell, checks that:
//  - required arguments are defined
//  - disabled or unknown arguments are not defined
//  - arguments that are defined follow correct syntax
//    Does not check for semantics (e.g. IDL validation)
const validateSyntax = function ({ args, action, idl }) {
  const schema = actionSchemas[action.name];
  validate({
    idl,
    schema,
    data: args,
    reportInfo: { type: 'clientInputSyntax', dataVar: 'args' },
  });
};

const getActionSchema = function ({ optional = [], required = [] }) {
  const optionalArgs = pick(argsSchema, [...optional, ...required]);
  const mappedArgs = mapKeys(optionalArgs, ({ name }, key) => name || key);
  const requiredArgs = required.map(name => argsSchema[name].name || name);
  const properties = mapValues(mappedArgs, value => omit(value, 'name'));

  return { properties, required: requiredArgs, ...commonSchema };
};

// JSON schemas validating `args` for each action
const actionSchemas = mapValues(actionsArgs, args => getActionSchema(args));

module.exports = {
  validateSyntax,
};
