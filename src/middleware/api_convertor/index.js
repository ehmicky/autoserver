'use strict';


const apiConvertor = function () {
  return async function apiConvertor(input) {
    const {
      api: { action, fullAction, args, modelName },
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
    const response = apiConvertorOutput[info.interface]({ data, metadata });
    return response;
  };
};

const apiConvertorOutput = {

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
  apiConvertor,
};
