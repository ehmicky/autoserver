'use strict';

const { throwError, addGenErrorHandler } = require('../../../../../errors');
const { validateDuplicates } = require('../duplicates');

// Apply GraphQL directives @include and @skip
const applyDirectives = function ({
  selection: { directives = [] },
  variables,
}) {
  // GraphQL spec 5.6.3 'Directives Are Unique Per Location'
  validateDuplicates({ nodes: directives, type: 'directives' });

  return directives
    .every(directive => applyDirective({ directive, variables }));
};

const applyDirective = function ({
  directive: {
    arguments: args,
    name: { value: directiveName },
  },
  variables,
}) {
  if (directiveName === 'include') {
    return eCheckDirective({ variables, args, directiveName });
  }

  if (directiveName === 'skip') {
    return !eCheckDirective({ variables, args, directiveName });
  }

  const message = `Unknown directive: '${directiveName}'`;
  throwError(message, { reason: 'SYNTAX_VALIDATION' });
};

const checkDirective = function ({ variables, args }) {
  if (args.length !== 1) {
    const message = 'Incorrect number of arguments';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  const [{
    name: { value: ifArgName } = {},
    value: { kind: ifKind, value: ifValue, name: { value: ifValueName } = {} },
  }] = args;

  if (ifArgName !== 'if') {
    const message = 'Invalid argument';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  return checkSpecificDirective({ ifKind, ifValue, variables, ifValueName });
};

const checkSpecificDirective = function ({
  ifKind,
  ifValue,
  variables,
  ifValueName,
}) {
  const directivesChecker = directivesCheckers[ifKind];

  if (!directivesChecker) {
    const message = 'Argument must be a variable or a boolean value.';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  return directivesChecker({ ifValue, variables, ifValueName });
};

const eCheckDirective = addGenErrorHandler(checkDirective, {
  message: ({ directiveName }) => `Error parsing directive '${directiveName}'`,
  reason: 'SYNTAX_VALIDATION',
});

const checkBooleanDirective = function ({ ifValue }) {
  return ifValue;
};

const checkVariableDirective = function ({ variables, ifValueName }) {
  const evaledValue = variables[ifValueName];

  if (typeof evaledValue !== 'boolean') {
    const message = 'Invalid variable';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
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
