'use strict';

const { addGenErrorHandler } = require('../error');
const { setAll } = require('../utilities');

const { getVarsKeys } = require('./vars');
const { isInlineFunc, isEscapedInlineFunc } = require('./test');
const { getInlineFunc } = require('./tokenize');

// Compile all schema inline functions, i.e. apply `new Function()`
const compileInlineFuncs = function ({ schema, schema: { inlineFuncPaths } }) {
  const varsKeys = getVarsKeys({ schema });

  const schemaA = setAll(
    schema,
    inlineFuncPaths,
    inlineFunc => compileInlineFunc({ inlineFunc, varsKeys }),
  );
  return { schema: schemaA };
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
