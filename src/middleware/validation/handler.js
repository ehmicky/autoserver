'use strict';


const { validateServerInputSyntax } = require('./server_input_syntax');
const { validateClientInputSyntax } = require('./client_input_syntax');
const { validateClientInputAction } = require('./client_input_action');
const { validateClientInputSemantics } = require('./semantics');
const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * API validation layer
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const validation = async function ({ idl }) {
  return async function (input) {
    const { modelName, args, action, info: { ip, timestamp, actionType, helpers, variables }, params } = input;

    // Extra information passed to custom validation keywords
    const jslInput = { helpers, variables, requestInput: { ip, timestamp, params }, modelInput: { actionType } };
    const jslInputData = Object.assign({ shortcutName: 'data' }, jslInput);
    const jslInputModel = Object.assign({ shortcutName: 'model' }, jslInput);

    validateServerInputSyntax({ idl, modelName, action, args });
    validateClientInputSyntax({ modelName, action, args });
    validateClientInputAction({ idl, modelName, action });
    validateClientInputSemantics({ idl, modelName, action, args });
    validateClientInputData({ idl, modelName, action, args, extra: jslInputData });

    const response = await this.next(input);
    validateServerOutputSyntax({ action, response });
    validateServerOutputData({ idl, modelName, response, action, extra: jslInputModel });

    return response;
  };
};


module.exports = {
  validation,
};
