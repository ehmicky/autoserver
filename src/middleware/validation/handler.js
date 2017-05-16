'use strict';


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
const validation = async function ({ idl, maxDataLength }) {
  return async function validation(input) {
    const { modelName, args, action, info, params } = input;
    const { ip, timestamp, actionType, helpers, variables } = info;

    // Extra information passed to custom validation keywords
    const requestInput = { ip, timestamp, params };
    const interfaceInput = { actionType };
    const jslInput = { helpers, variables, requestInput, interfaceInput };
    const jslInputData = Object.assign({ shortcutName: 'data' }, jslInput);
    const jslInputModel = Object.assign({ shortcutName: 'model' }, jslInput);

    validateClientInputSyntax({ modelName, action, args });
    validateClientInputAction({ idl, modelName, action });
    validateClientInputSemantics({
      idl,
      modelName,
      action,
      args,
      maxDataLength,
    });
    validateClientInputData({
      idl,
      modelName,
      action,
      args,
      extra: jslInputData,
    });

    const response = await this.next(input);
    validateServerOutputSyntax({ action, response });
    validateServerOutputData({
      idl,
      modelName,
      response,
      action,
      extra: jslInputModel,
    });

    return response;
  };
};


module.exports = {
  validation,
};
