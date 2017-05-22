'use strict';


const { each } = require('lodash');

const { runJsl } = require('../../jsl');
const { EngineError } = require('../../error');


// Apply `transformValue` recursively
const getTransform = ({ direction }) => function transformFunc(opts) {
  const { value, propsIdl } = opts;
  opts.props = transformProps[direction];
  // Recursion
  if (value instanceof Array) {
    return value.map(child => {
      return transformFunc(Object.assign({}, opts, { value: child }));
    });
  }

  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (value.constructor !== Object) { return value; }

  // Iterate over IDL for that model, to find models that have transforms
  each(propsIdl, (propIdl, attrName) => {
    transformValue(Object.assign({ propIdl, attrName }, opts));
  });

  return value;
};

// Do the actual transformation
const transformValue = function (opts) {
  const {
    value,
    attrName,
    props: { TRANSFORM_NAME, COMPUTE_NAME },
    propIdl,
  } = opts;

  const compute = propIdl[COMPUTE_NAME];
  singleTransformValue(Object.assign({}, opts, { transformer: compute }));

  if (value[attrName] !== undefined) {
    const transform = propIdl[TRANSFORM_NAME];
    singleTransformValue(Object.assign({}, opts, { transformer: transform }));
  }
};

const singleTransformValue = function (opts) {
  const {
    value,
    attrName,
    transformer,
    props: { VARIABLE_NAME },
    jslInput,
  } = opts;

  if (transformer === undefined) { return; }

  // If transform is an array, apply the first transform that works,
  // i.e. is like a switch statement
  if (transformer instanceof Array) {
    return transformer.find(transformer => {
      return singleTransformValue(Object.assign({}, opts, { transformer }));
    });
  }

  // Performs actual substitution
  let newValue;
  try {
    const modelInput = {
      parent: value,
      [VARIABLE_NAME]: value,
      value: value[attrName],
    };
    newValue = runJsl(transformer, jslInput, { modelInput });
  } catch (innererror) {
    const message = `JSL expression used as transform failed: '${transformer.jsl}'`;
    throw new EngineError(message, {
      reason: 'IDL_RUNTIME_VALIDATION',
      innererror,
    });
  }

  // Transforms that return undefined do not apply
  // This allows conditional transforms,
  // e.g. { age: '$ > 30 ? $ - 1 : undefined' }
  if (newValue === undefined) { return; }

  value[attrName] = newValue;
  return true;
};

// Input and output transforms have few differences, gathered here
const transformProps = {
  input: {
    // IDL transform names depends on direction
    TRANSFORM_NAME: 'transform',
    COMPUTE_NAME: 'compute',
    VARIABLE_NAME: 'data',
  },
  output: {
    TRANFORM_NAME: 'transformOut',
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
