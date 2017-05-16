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
    const {
      modelName,
      args,
      action,
      dbAction,
      dbFullAction,
      info,
      params,
    } = input;
    const { ip, timestamp, helpers, variables } = info;

    // Extra information passed to custom validation keywords
    const requestInput = { ip, timestamp, params };
    const interfaceInput = { dbAction };
    const jslInput = { helpers, variables, requestInput, interfaceInput };
    const jslInputData = Object.assign({ shortcutName: 'data' }, jslInput);
    const jslInputModel = Object.assign({ shortcutName: 'model' }, jslInput);

    validateClientInputSyntax({ modelName, action, dbFullAction, args });
    validateClientInputAction({ idl, action, dbFullAction, modelName });
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
      dbFullAction,
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
      dbFullAction,
      args,
      extra: jslInputModel,
    });

    return response;
  };
};


module.exports = {
  validation,
};
