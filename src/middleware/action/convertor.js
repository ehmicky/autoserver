'use strict';


const { cloneDeep } = require('lodash');


// Converts from Operation format to Action format
const actionConvertor = function () {
  return async function actionConvertor(input) {
    const {
      action,
      fullAction,
      args,
      modelName,
      jsl,
      log,
      params,
      operation,
    } = input;
    const perf = log.perf.start('action.convertor', 'middleware');

    // Request arguments that cannot be specified by clients
    const clonedArgs = cloneDeep(args);
    const newJsl = jsl.add({ $MODEL: modelName });

    const nextInput = {
      action,
      fullAction,
      args,
      modelName,
      jsl: newJsl,
      log,
      params,
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
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  GraphQL(response) {
    const { data, metadata } = response;

    if (data instanceof Array) {
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
  const logData = data instanceof Array ? data : [data];
  return logData.map(content => ({ content }));
};


module.exports = {
  actionConvertor,
};
