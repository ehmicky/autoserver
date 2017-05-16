'use strict';


const { actions } = require('../../idl');


const apiConvertor = async function () {
  return async function apiConvertor(input) {
    const { api: { action, args, modelName }, info, params } = input;
    const { actionType } = actions.find(({ name }) => name === action) || {};
    info.actionType = actionType;
    const nextInput = { action, actionType, args, modelName, info, params };

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
