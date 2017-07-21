'use strict';

const {
  functionFuncNames,
  sideEffectsFuncNames,
  globalFuncNames,
  asyncFuncNames,
} = require('./func_names');

// Blacklist which function can be called
const validateCallExpression = function (node) {
  return validateSimpleFunction(node) ||
    validateFuncNames(node) ||
    validateWrongAssign(node);
};

const validateSimpleFunction = function ({ callee: { type, property } }) {
  const usesIdentifier = type === 'Identifier';
  const usesMemberExpression = type === 'MemberExpression' &&
    property.type === 'Identifier';

  if (usesIdentifier || usesMemberExpression) { return; }

  return 'Function calls must be like: \'func()\' or \'obj.func()\'';
};

const validateFuncNames = function ({ callee: { type, property, name } }) {
  const funcName = getFuncName({ type, property, name });
  const funcNameMessage = funcNames.find(({ values }) =>
    values.includes(funcName)
  );
  if (!funcNameMessage) { return; }

  return funcNameMessage.message(funcName);
};

const funcNames = [
  {
    values: functionFuncNames,
    message: funcName => `Cannot call '${funcName}()'`,
  },
  {
    values: sideEffectsFuncNames,
    message: funcName => `No side-effects: cannot call '${funcName}()'`,
  },
  {
    values: globalFuncNames,
    message: funcName =>
      `No access to global state: cannot call '${funcName}()'`,
  },
  {
    values: asyncFuncNames,
    message: funcName => `Must be synchronous: cannot call '${funcName}()'`,
  },
];

const validateWrongAssign = function ({
  callee: { type, property, name },
  arguments: args,
}) {
  const funcName = getFuncName({ type, property, name });
  const isWrongAssign = funcName === 'assign' &&
    (!args[0] || args[0].type !== 'ObjectExpression');
  if (!isWrongAssign) { return; }

  return 'No side-effects: \'Object.assign()\' first argument must be a literal object';
};

const getFuncName = function ({ type, property, name }) {
  const usesMemberExpression = type === 'MemberExpression' &&
    property.type === 'Identifier';
  const funcName = usesMemberExpression ? property.name : name;
  return funcName;
};

module.exports = {
  validateCallExpression,
};
