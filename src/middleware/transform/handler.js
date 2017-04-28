'use strict';


const { actions } = require('../../idl');
const { transformInput, transformOutput } = require('./transformer');


/**
 * Applies schema `transform`, `transformOut`, `default` and `defaultOut`.
 * Those are mapping functions applies on input or output for a particular attribute.
 * `transform` and `default` are applied on input, `transformOut` and `defaultOut` are applied on output.
 * If the value is defined, only `transform[Out]` is applied.
 * If the value is undefined, `default[Out]` is applied first, then `transform[Out]`
 * (providing a value was assigned by `default[Out]`).
 * They can be any static value, e.g. { name: { default: 15 } }.
 * They can contain JSL, e.g. { name: { default: '($$.former_name)' } }. $attribute will refer to input or output data.
 * `default[Out]` is not applied on 'update' actions input, since this is partial update.
 **/
const transform = async function ({ idl }) {
  return async function (input) {
    const { args, modelName, action, info, params } = input;
    const jslVarsInput = { info, params };
    const { actionType } = actions.find(({ name }) => name === action);

    // Retrieves IDL definition for this model
    const modelIdl = idl.models[modelName];
    const propsIdl = modelIdl && modelIdl.properties;
    const transformArgs = { propsIdl, actionType, jslVarsInput };

    // Transform input, then output
    if (args.data) {
      args.data = transformInput(Object.assign({ value: args.data }, transformArgs));
    }

    const response = await this.next(input);
    const transformedResponse = transformOutput(Object.assign({ value: response }, transformArgs));

    return transformedResponse;
  };
};



module.exports = {
  transform,
};
