'use strict';

const { addGenErrorHandler } = require('../error');
const { set, getValues } = require('../utilities');

const { getVarsKeys } = require('./vars');
const { isInlineFunc, isEscapedInlineFunc } = require('./test');
const { getInlineFunc } = require('./tokenize');

// Compile all schema inline functions, i.e. apply `new Function()`
const compileInlineFuncs = function ({ schema }) {
  const varsKeys = getVarsKeys({ schema });

  const schemaB = getValues(schema).reduce(
    (schemaA, { keys, value }) =>
      setInlineFunc({ schema: schemaA, keys, value, varsKeys }),
    schema,
  );
  return schemaB;
};

const setInlineFunc = function ({ schema, keys, value, varsKeys }) {
  const inlineFunc = compileInlineFunc({ inlineFunc: value, varsKeys });
  return set(schema, keys, inlineFunc);
};

// Transform inline functions into a function with the inline function as body
// Returns if it is not inline function
// This can throw if inline function's JavaScript is wrong
const compileInlineFunc = function ({ inlineFunc, varsKeys }) {
  // If this is not inline function, abort
  if (!isInlineFunc({ inlineFunc })) {
    return getNonInlineFunc({ inlineFunc });
  }

  const inlineFuncA = getInlineFunc({ inlineFunc });

  return eCreateFunction({ inlineFunc: inlineFuncA, varsKeys });
};

const getNonInlineFunc = function ({ inlineFunc }) {
  // Can escape (...) from being interpreted as inline function by escaping
  // first parenthesis
  if (isEscapedInlineFunc({ inlineFunc })) {
    return inlineFunc.replace('\\', '');
  }

  return inlineFunc;
};

const createFunction = function ({
  inlineFunc,
  varsKeys: { namedKeys, posKeys },
}) {
  // Create a function with the inline function as body
  // eslint-disable-next-line no-new-func
  return new Function(
    `{ ${namedKeys} }, ${posKeys}`,
    `return (${inlineFunc});`,
  );
};

const eCreateFunction = addGenErrorHandler(createFunction, {
  message: ({ inlineFunc }) => `Invalid schema function: '${inlineFunc}'`,
  reason: 'SCHEMA_VALIDATION',
});

module.exports = {
  compileInlineFuncs,
};
