'use strict';

const { throwError, addGenErrorHandler } = require('../../../../../error');

const applyDirectives = function ({ directives = [], variables }) {
  return directives.every(applyDirective.bind(null, variables));
};

const applyDirective = function (
  variables,
  {
    arguments: args,
    name: { value: directiveName },
  },
) {
  if (directiveName === 'include') {
    return eCheckDirective({ variables, args, directiveName });
  }

  if (directiveName === 'skip') {
    return !eCheckDirective({ variables, args, directiveName });
  }

  return true;
};

const checkDirective = function ({ variables, args }) {
  if (args.length !== 1) {
    throwError('Incorrect number of arguments');
  }

  const [{
    name: { value: ifArgName } = {},
    value: { kind: ifKind, value: ifValue, name: { value: ifValueName } = {} },
  }] = args;

  if (ifArgName !== 'if') {
    throwError('Invalid argument');
  }

  const checkSpecificDirective = directivesCheckers[ifKind];

  if (!checkSpecificDirective) {
    throwError('Argument must be a variable or a boolean value.');
  }

  return checkSpecificDirective({ ifValue, variables, ifValueName });
};

const eCheckDirective = addGenErrorHandler(checkDirective, {
  message: ({ directiveName }) => `Error parsing directive '${directiveName}'`,
  reason: 'GRAPHQL_SYNTAX_ERROR',
});

const checkBooleanDirective = function ({ ifValue }) {
  return ifValue;
};

const checkVariableDirective = function ({ variables, ifValueName }) {
  const evaledValue = variables[ifValueName];

  if (typeof evaledValue !== 'boolean') {
    throwError('Invalid variable');
  }

  return evaledValue;
};

const directivesCheckers = {
  BooleanValue: checkBooleanDirective,
  Variable: checkVariableDirective,
};

module.exports = {
  applyDirectives,
};
