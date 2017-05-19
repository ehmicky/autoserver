'use strict';


const actionConvertor = function () {
  return async function actionConvertor(input) {
    const {
      actionInput: { action, fullAction, args, modelName },
      info,
      protocol,
      interf,
    } = input;
    info.action = action;
    // Request arguments that cannot be specified by clients
    const sysArgs = {};
    const nextInput = {
      action,
      fullAction,
      args,
      sysArgs,
      modelName,
      info,
      interf,
      protocol,
    };

    const { data, metadata } = await this.next(nextInput);
    const response = actionConvertorOutput[info.interface]({ data, metadata });
    return response;
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
