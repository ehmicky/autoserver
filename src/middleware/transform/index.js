'use strict';


const { each, merge, isEqual } = require('lodash');

const { EngineError } = require('../../error');
const { actions } = require('../../idl');
const { processJsl, evalJslModel, evalJslData, getJslVariables } = require('../jsl');


/**
 * Applies schema `transform`, `transform_out`, `default` and `default_out`.
 * Those are mapping functions applies on input or output for a particular attribute.
 * `transform` and `default` are applied on input, `transform_out` and `default_out` are applied on output.
 * If the value is defined, only `transform[_out]` is applied.
 * If the value is undefined, `default[_out]` is applied first, then `transform[_out]`
 * (providing a value was assigned by `default[_out]`).
 * They can be any static value, e.g. { name: { default: 15 } }.
 * They can contain JSL, e.g. { name: { default: '$former_name' } }. $attribute will refer to input or output data.
 * `default[_out]` is not applied on 'update' actions input, since this is partial update.
 **/
const transform = async function ({ idl }) {
  return async function (input) {
    const { args, modelName, action, info, params } = input;
    const { actionType } = actions.find(({ name }) => name === action);

    // Retrieves IDL definition for this model
    const modelIdl = idl.models[modelName];
    const propsIdl = modelIdl && modelIdl.properties;
    const transformArgs = { propsIdl, actionType, info, params };

    if (args.data) {
      args.data = transformInput(Object.assign({ value: args.data }, transformArgs));
    }

    const response = await this.next(input);
    const transformedResponse = transformOutput(Object.assign({ value: response }, transformArgs));

    checkIdempotency({ value: transformedResponse, transformArgs, modelName });

    return transformedResponse;
  };
};

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
  const { value, attrName, direction, props: { DEFAULT_NAME, NON_DEFAULT_NAME }, propIdl, actionType } = opts;

  // 'update' actions do not use default values on input
  if (actionType === 'update' && direction === 'input' && value[attrName] === undefined) { return; }

  // If the value is undefined, apply `default` first, so it can be processed by `transform` right after,
  // providing `default` did assign the value
  if (value[attrName] === undefined) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[DEFAULT_NAME] }));
  }
  if (value[attrName] !== undefined) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[NON_DEFAULT_NAME] }));
  }
};

const singleTransformValue = function ({ value, attrName, transformer, props: { VARIABLE_NAME, PROCESSOR }, info, params }) {
  if (!transformer) { return; }

  // Assign $ or $attr variables
  const variables = getJslVariables(Object.assign({ info, params }, { [VARIABLE_NAME]: value }));
  // Performs actual substitution
  const newValue = processJsl({ value: transformer, name: attrName, variables, processor: PROCESSOR });

  // Transforms|defaults that return undefined do not apply
  // This allows conditional transforms|defaults, e.g. { age: '$ > 30 ? $ - 1 : undefined' }
  if (newValue === undefined) { return; }

  value[attrName] = newValue;
};

// Input and output transforms have few differences, gathered here
const transformProps = {
  input: {
    // IDL transform names depends on direction
    DEFAULT_NAME: 'default',
    NON_DEFAULT_NAME: 'transform',
    // $ and $attr refer to either input data (`data`) or output data (`model`)
    PROCESSOR: evalJslData,
    VARIABLE_NAME: 'data',
  },
  output: {
    DEFAULT_NAME: 'default_out',
    NON_DEFAULT_NAME: 'transform_out',
    PROCESSOR: evalJslModel,
    VARIABLE_NAME: 'model',
  },
};
const transformInput = getTransform({ direction: 'input' });
const transformOutput = getTransform({ direction: 'output' });

// Checks that transform are idempotent
// I.e. when transform[_out] is applied twice, it should return same result as when applied once
// The reason is: transforms are meant to bring the value to a 'stable' state, not to augment it. Otherwise, it would
// break basic CRUD semantics clients expect when it comes to request idempotency.
// TODO: do this during IDL validation instead.
const checkIdempotency = function ({ value, transformArgs, modelName }) {
  value = value instanceof Array ? value : [value];
  const beforeInput = value.map(val => merge({}, val));
  const afterInput = transformInput(Object.assign({ value: beforeInput }, transformArgs));
  const afterOutput = transformOutput(Object.assign({ value: afterInput }, transformArgs));
  value.forEach((val, key) => {
    each(val, (attr, attrName) => {
      const afterAttr = afterOutput[key][attrName];
      if (!isEqual(attr, afterAttr)) {
        throw new EngineError(`${modelName}.${attrName} transform is not idempotent, \
as resubmitting value '${attr}' would change it to '${afterAttr}'`, { reason: 'TRANSFORM_IDEMPOTENCY' });
      }
    });
  });
};


module.exports = {
  transform,
};
