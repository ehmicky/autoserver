'use strict';


const { each } = require('lodash');

const { actions } = require('../../idl');
const { processJsl, evalJslModel, evalJslData, getJslVariables } = require('../jsl');


/**
 * Applies schema `transform`, `transform_out`, `default` and `default_out`.
 * Those are mapping functions applies on input or output for a particular attribute.
 * `transform` and `default` are applied on input, `transform_out` and `default_out` are applied on output.
 * `default[_out]` are applied if value is undefined, `transform[_out]` if it is defined.
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

  return function transformFunc({ value, propsIdl, actionType, info, params }) {
    // Recursion
    if (value instanceof Array) {
      return value.map(child => transformFunc({ value: child, propsIdl, actionType, info, params }));
    }

    // Value should be an object if valid, but it might be invalid and the validation layer is not fired yet on input
    if (value.constructor !== Object) { return value; }

    // Iterate over IDL for that model, to find models that have transforms/defaults
    each(propsIdl, (propIdl, attrName) => {
      const child = value[attrName];

      // 'update' actions do not use default values on input
      if (actionType === 'update' && direction === 'input' && child === undefined) { return; }

      const transformName = child === undefined ? defaultName : nonDefaultName;
      const transformer = propIdl[transformName];
      if (!transformer) { return; }

      // Assign $ or $attr variables
      const variables = getJslVariables(Object.assign({ info, params }, { [variableName]: value }));
      // Performs actual substitution
      value[attrName] = processJsl({ value: transformer, name: attrName, variables, processor });
    });

    return value;
  };
};
const transformInput = getTransform({ direction: 'input' });
const transformOutput = getTransform({ direction: 'output' });


module.exports = {
  transform,
};
