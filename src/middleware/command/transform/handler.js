'use strict';


const { transformInput, transformOutput } = require('./transformer');


/**
 * Applies schema `transform` and `transformOut`
 * Those are mapping functions applies on input or output
 * for a particular attribute.
 * `transform` is applied on input, `transformOut` is applied on output.
 * They can be any static value or JSL.
 **/
const transform = function ({ idl: { models } }) {
  return async function transform(input) {
    const { args, jsl, modelName, log } = input;
    const perf = log.perf.start('transform', 'middleware');

    // Retrieves IDL definition for this model
    const modelIdl = models[modelName];
    const propsIdl = modelIdl && modelIdl.properties;
    const transformArgs = { propsIdl, jsl };

    // Transform input, then output
    if (args.data) {
      const tfArg = Object.assign({ value: args.data }, transformArgs);
      args.data = transformInput(tfArg);
    }

    perf.stop();
    const response = await this.next(input);
    perf.start();

    const tfArg = Object.assign({ value: response.data }, transformArgs);
    response.data = transformOutput(tfArg);

    perf.stop();
    return response;
  };
};



module.exports = {
  transform,
};
