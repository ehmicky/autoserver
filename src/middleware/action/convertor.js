'use strict';

const { cloneDeep } = require('lodash');

// Converts from Operation format to Action format
const actionConvertor = async function ({
  action,
  fullAction,
  args,
  modelName,
  jsl,
  log,
  idl,
  serverOpts,
  apiServer,
  params,
  settings,
  operation,
}) {
  const perf = log.perf.start('action.convertor', 'middleware');

  // Request arguments that cannot be specified by clients
  const clonedArgs = cloneDeep(args);
  const newJsl = jsl.add({ $MODEL: modelName });

  // Not kept: goal, queryVars, pathVars, payload, route, operation
  const nextInput = {
    action,
    fullAction,
    args,
    modelName,
    jsl: newJsl,
    log,
    idl,
    serverOpts,
    apiServer,
    params,
    settings,
  };

  let response;

  try {
    perf.stop();
    response = await this.next(nextInput);
    perf.start();
  } catch (error) {
    const perf = log.perf.start('action.convertor', 'exception');

    // Added only for final error handler
    log.add({ action, fullAction, model: modelName });

    perf.stop();
    throw error;
  }

  response.action = action;

  const responses = getLogResponses(response);
  const logAction = { model: modelName, args: clonedArgs, responses };
  const logActions = { [fullAction]: logAction };
  log.add({ actions: logActions });

  const transformedResponse = actionConvertorOutput[operation](response);

  perf.stop();
  return transformedResponse;
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  GraphQL (response) {
    const { data, metadata } = response;

    if (Array.isArray(data)) {
      response.data = data.map((datum, index) => {
        return Object.assign({}, datum, { __metadata: metadata[index] });
      });
    } else {
      response.data = Object.assign({}, data, { __metadata: metadata });
    }

    return response;
  },

};

const getLogResponses = function ({ data }) {
  const logData = Array.isArray(data) ? data : [data];
  return logData.map(content => ({ content }));
};

module.exports = {
  actionConvertor,
};
