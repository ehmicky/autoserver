'use strict';


const { actions } = require('../../idl');
const { transformInput, transformOutput } = require('./transformer');
const { checkIdempotency } = require('./idempotency');


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

    // Transform input, then output
    if (args.data) {
      args.data = transformInput(Object.assign({ value: args.data }, transformArgs));
    }

    const response = await this.next(input);
    const transformedResponse = transformOutput(Object.assign({ value: response }, transformArgs));

    // Make sure transforms are idempotent
    checkIdempotency({ value: transformedResponse, transformArgs, modelName });

    return transformedResponse;
  };
};



module.exports = {
  transform,
};
