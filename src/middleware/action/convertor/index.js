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
      params,
      interface: interf,
    } = input;

    // Request arguments that cannot be specified by clients
    const sysArgs = {};
    const newJsl = jsl.add({
      ARGS: cloneDeep(args),
      MODEL: modelName,
    });

    const nextInput = {
      action,
      fullAction,
      args,
      sysArgs,
      modelName,
      jsl: newJsl,
      params,
    };

    const { data, metadata } = await this.next(nextInput);

    const content = actionConvertorOutput[interf]({ data, metadata });
    const modifiers = {};

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


module.exports = {
  actionConvertor,
};
