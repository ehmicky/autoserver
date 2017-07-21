'use strict';

const { cloneDeep } = require('lodash');

const { pick } = require('../../../utilities');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (input) {
  const { args, modelName, jsl, log, action, fullAction } = input;

  const trimmedInput = pick(input, actionAttributes);

  const newJsl = jsl.add({ $MODEL: modelName });
  const nextInput = Object.assign({}, trimmedInput, { jsl: newJsl });

  // Request arguments that cannot be specified by clients
  const clonedArgs = cloneDeep(args);

  try {
    const response = await this.next(nextInput);

    const logActions = getLogActions({ input, response, args });
    log.add({ actions: logActions });

    const transformedResponse = getTransformedResponse({
      input,
      response,
      args: clonedArgs,
    });
    return transformedResponse;
  } catch (error) {
    // Added only for final error handler
    log.add({ action, fullAction, model: modelName });

    throw error;
  }
};

// Not kept: goal, queryVars, pathVars, payload, route, operation
const actionAttributes = [
  'action',
  'fullAction',
  'args',
  'modelName',
  'log',
  'perf',
  'idl',
  'serverOpts',
  'apiServer',
  'params',
  'settings',
];

module.exports = {
  actionConvertor,
};
