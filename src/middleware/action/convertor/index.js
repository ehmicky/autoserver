'use strict';


const { cloneDeep } = require('lodash');


// Converts from Interface format to Action format
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
      interface: interf,
    } = input;

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
      response = await this.next(nextInput);
    } catch (error) {
      // Added only for final error handler
      log.add({ action, fullAction, args: clonedArgs, model: modelName });
      throw error;
    }

    const { data, metadata } = response;

    const content = actionConvertorOutput[interf]({ data, metadata });
    const modifiers = {};

    const responses = getLogResponses({ data });
    const logAction = { model: modelName, args: clonedArgs, responses };
    const logActions = { [fullAction]: logAction };
    log.add({ actions: logActions });

    return { content, modifiers };
  };
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  graphql({ data, metadata }) {
    if (data instanceof Array) {
      return data.map((datum, index) => {
        return Object.assign({}, datum, { __metadata: metadata[index] });
      });
    } else {
      return Object.assign({}, data, { __metadata: metadata });
    }
  },

};

const getLogResponses = function ({ data }) {
  const logData = data instanceof Array ? data : [data];
  return logData.map(content => ({ content }));
};


module.exports = {
  actionConvertor,
};
