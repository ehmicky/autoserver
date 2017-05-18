'use strict';


const { validateClientInputSyntax } = require('./client_input_syntax');
const { validateClientInputCommand } = require('./client_input_command');
const { validateClientInputSemantics } = require('./semantics');
const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * API validation layer
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const validation = function ({ idl, maxDataLength }) {
  return async function validation(input) {
    const {
      modelName,
      args,
      sysArgs,
      command,
      info,
      params,
    } = input;
    const { ip, timestamp, helpers, variables, action } = info;

    // Extra information passed to custom validation keywords
    const requestInput = { ip, timestamp, params };
    const interfaceInput = { command };
    const jslInput = { helpers, variables, requestInput, interfaceInput };
    const jslInputData = Object.assign({ shortcutName: 'data' }, jslInput);
    const jslInputModel = Object.assign({ shortcutName: 'model' }, jslInput);

    validateClientInputSyntax({ modelName, action, command, args });
    validateClientInputCommand({ idl, action, command, modelName, sysArgs });
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
      command,
      args,
      extra: jslInputData,
    });

    const response = await this.next(input);
    validateServerOutputSyntax({ command, response });
    validateServerOutputData({
      idl,
      modelName,
      response,
      action,
      command,
      args,
      extra: jslInputModel,
    });

    return response;
  };
};


module.exports = {
  validation,
};
