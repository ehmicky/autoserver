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
      logInfo,
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
      logInfo,
      params,
    };

    const { data, metadata } = await this.next(nextInput);

    const content = actionConvertorOutput[interf]({ data, metadata });
    const modifiers = {};

    const responses = getLogResponses({ data, metadata });
    const logAction = { model: modelName, args: clonedArgs, responses };
    const logActions = { [fullAction]: logAction };
    logInfo.add({ actions: logActions });

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

const getLogResponses = function ({ data, metadata }) {
  const logData = data instanceof Array ? data : [data];
  const logMetadata = metadata instanceof Array ? metadata : [metadata];
  return logData.map((content, index) => {
    const metadatum = logMetadata[index];
    const pageSize = (metadatum.pages && metadatum.pages.page_size) || null;
    return { content, pageSize };
  });
};


module.exports = {
  actionConvertor,
};
