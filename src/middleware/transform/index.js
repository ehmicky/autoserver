'use strict';


const { each } = require('lodash');

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

    if (args.data) {
      args.data = transformInput({ value: args.data, propsIdl, actionType, info, params });
    }

    const response = await this.next(input);
    const transformedResponse = transformOutput({ value: response, propsIdl, actionType, info, params });

    return transformedResponse;
  };
};

// Factory method for differentiating transformation according to direction (input|output)
const getTransform = ({ direction }) => {
  // IDL transform names depends on direction
  const defaultName = direction === 'input' ? 'default' : 'default_out';
  const nonDefaultName = direction === 'input' ? 'transform' : 'transform_out';
  // $ and $attr refer to either input data (`data`) or output data (`model`)
  const processor = direction === 'input' ? evalJslData : evalJslModel;
  const variableName = direction === 'input' ? 'data' : 'model';
  return getTransformFunc({ direction, defaultName, nonDefaultName, processor, variableName });
};

// Apply `transformValue` recursively
const getTransformFunc = (factoryOpts) => function transformFunc(opts) {
  const { value, propsIdl } = opts;
  // Recursion
  if (value instanceof Array) {
    return value.map(child => transformFunc(Object.assign({}, opts, { value: child })));
  }

  // Value should be an object if valid, but it might be invalid since the validation layer is not fired yet on input
  if (value.constructor !== Object) { return value; }

  // Iterate over IDL for that model, to find models that have transforms/defaults
  each(propsIdl, (propIdl, attrName) => {
    transformValue(Object.assign({ propIdl, attrName }, factoryOpts, opts));
  });

  return value;
};

// Do the actual transformation
const transformValue = function (opts) {
  const { value, attrName, direction, defaultName, nonDefaultName, propIdl, actionType } = opts;

  // 'update' actions do not use default values on input
  if (actionType === 'update' && direction === 'input' && value[attrName] === undefined) { return; }

  // If the value is undefined, apply `default` first, so it can be processed by `transform` right after,
  // providing `default` did assign the value
  if (value[attrName] === undefined) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[defaultName] }));
  }
  if (value[attrName] !== undefined) {
    singleTransformValue(Object.assign({}, opts, { transformer: propIdl[nonDefaultName] }));
  }
};

const singleTransformValue = function ({ value, attrName, transformer, processor, variableName, info, params }) {
  if (!transformer) { return; }

  // Assign $ or $attr variables
  const variables = getJslVariables(Object.assign({ info, params }, { [variableName]: value }));
  // Performs actual substitution
  const newValue = processJsl({ value: transformer, name: attrName, variables, processor });

  // Transforms|defaults that return undefined do not apply
  // This allows conditional transforms|defaults, e.g. { age: '$ > 30 ? $ - 1 : undefined' }
  if (newValue === undefined) { return; }

  value[attrName] = newValue;
};

const transformInput = getTransform({ direction: 'input' });
const transformOutput = getTransform({ direction: 'output' });


module.exports = {
  transform,
};
