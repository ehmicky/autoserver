'use strict';


const { each } = require('lodash');

const { processJsl } = require('../../jsl');
const { EngineError } = require('../../error');


// Apply `transformValue` recursively
const getTransform = ({ direction }) => function transformFunc(opts) {
  const { value, propsIdl } = opts;
  opts.props = transformProps[direction];
  // Recursion
  if (value instanceof Array) {
    return value.map(child => transformFunc(Object.assign({}, opts, { value: child })));
  }

  // Value should be an object if valid, but it might be invalid since the validation layer is not fired yet on input
  if (value.constructor !== Object) { return value; }

  // Iterate over IDL for that model, to find models that have transforms/defaults
  each(propsIdl, (propIdl, attrName) => {
    transformValue(Object.assign({ propIdl, attrName, direction }, opts));
  });

  return value;
};

// Do the actual transformation
const transformValue = function (opts) {
  const { value, attrName, direction, props: { DEFAULT_NAME, NON_DEFAULT_NAME, COMPUTE_NAME }, propIdl, actionType } = opts;

  singleTransformValue(Object.assign({}, opts, { transformer: propIdl[COMPUTE_NAME] }));

  // 'update' actions do not use default values on input
  const isUpdateInput = actionType === 'update' && direction === 'input';
  // If the value is undefined, apply `default` first, so it can be processed by `transform` right after,
  // providing `default` did assign the value
  if (value[attrName] === undefined && !isUpdateInput) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[DEFAULT_NAME] }));
  }
  if (value[attrName] !== undefined) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[NON_DEFAULT_NAME] }));
  }
};

const singleTransformValue = function (opts) {
  const { value, attrName, transformer, props: { VARIABLE_NAME }, jslInput } = opts;

  if (transformer === undefined) { return; }

  // If transform is an array, apply the first transform that works, i.e. is like a switch statement
  if (transformer instanceof Array) {
    return transformer.find(singleTransformer => {
      return singleTransformValue(Object.assign({}, opts, { transformer: singleTransformer }));
    });
  }

  // Performs actual substitution
  let newValue;
  try {
    const modelInput = Object.assign({}, jslInput.modelInput, { attrName, [VARIABLE_NAME]: value, shortcut: value });
    newValue = processJsl(Object.assign({ jsl: transformer }, jslInput, { modelInput }));
  } catch (innererror) {
    throw new EngineError(`JSL expression used as transform failed: ${transformer}`, {
      reason: 'WRONG_TRANSFORM',
      innererror,
    });
  }

  // Transforms|defaults that return undefined do not apply
  // This allows conditional transforms|defaults, e.g. { age: '$ > 30 ? $ - 1 : undefined' }
  if (newValue === undefined) { return; }

  value[attrName] = newValue;
  return true;
};

// Input and output transforms have few differences, gathered here
const transformProps = {
  input: {
    // IDL transform names depends on direction
    DEFAULT_NAME: 'default',
    NON_DEFAULT_NAME: 'transform',
    COMPUTE_NAME: 'compute',
    VARIABLE_NAME: 'data',
  },
  output: {
    DEFAULT_NAME: 'defaultOut',
    NON_DEFAULT_NAME: 'transformOut',
    COMPUTE_NAME: 'computeOut',
    VARIABLE_NAME: 'model',
  },
};
const transformInput = getTransform({ direction: 'input' });
const transformOutput = getTransform({ direction: 'output' });


module.exports = {
  transformInput,
  transformOutput,
};
