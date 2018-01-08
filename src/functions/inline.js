'use strict';

const { addGenErrorHandler } = require('../errors');
const { set, getValues } = require('../utilities');

const { getParamsKeys } = require('./params');
const { isInlineFunc, isEscapedInlineFunc } = require('./test');
const { getInlineFunc } = require('./tokenize');

// Create all config inline functions, i.e. apply `new Function()`
const createInlineFuncs = function ({ config }) {
  const paramsKeys = getParamsKeys({ config });

  const configB = getValues(config).reduce(
    (configA, { keys, value }) =>
      setInlineFunc({ config: configA, keys, value, paramsKeys }),
    config,
  );
  return configB;
};

const setInlineFunc = function ({ config, keys, value, paramsKeys }) {
  const inlineFunc = createInlineFunc({ inlineFunc: value, paramsKeys });
  return set(config, keys, inlineFunc);
};

// Transform inline functions into a function with the inline function as body
// Returns if it is not inline function
// This can throw if inline function's JavaScript is wrong
const createInlineFunc = function ({ inlineFunc, paramsKeys }) {
  // If this is not inline function, abort
  if (!isInlineFunc({ inlineFunc })) {
    return getNonInlineFunc({ inlineFunc });
  }

  const inlineFuncA = getInlineFunc({ inlineFunc });

  return eCreateFunction({ inlineFunc: inlineFuncA, paramsKeys });
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
  paramsKeys: { namedKeys, posKeys },
}) {
  // Create a function with the inline function as body
  // eslint-disable-next-line no-new-func
  return new Function(
    `{ ${namedKeys} }, ${posKeys}`,
    `return (${inlineFunc});`,
  );
};

const eCreateFunction = addGenErrorHandler(createFunction, {
  message: ({ inlineFunc }) => `Invalid function: '${inlineFunc}'`,
  reason: 'CONFIG_VALIDATION',
});

module.exports = {
  createInlineFuncs,
};
