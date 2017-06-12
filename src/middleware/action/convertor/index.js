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
    const sysArgs = {};
    const clonedArgs = cloneDeep(args);
    const newJsl = jsl.add({
      $ARGS: clonedArgs,
      $MODEL: modelName,
    });

    const nextInput = {
      action,
      fullAction,
      args,
      sysArgs,
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
      log.add({ action, fullAction, args: clonedArgs, model: modelName });

      perf.stop();
      throw error;
    }

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
  GraphQL({ data, metadata }) {
    if (data instanceof Array) {
      data = data.map((datum, index) => {
        return Object.assign({}, datum, { __metadata: metadata[index] });
      });
    } else {
      data = Object.assign({}, data, { __metadata: metadata });
    }
    return { data, metadata };
  },

};

const getLogResponses = function ({ data }) {
  const logData = data instanceof Array ? data : [data];
  return logData.map(content => ({ content }));
};


module.exports = {
  actionConvertor,
};
