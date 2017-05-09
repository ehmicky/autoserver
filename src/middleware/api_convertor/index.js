'use strict';


const { actions } = require('../../idl');


const apiConvertor = async function () {
  return async function (input) {
    const { api: { action, args, modelName }, info, params } = input;
    const actionType = (actions.find(({ name }) => name === action) || {}).actionType;
    info.actionType = actionType;
    const { data, metadata } = await this.next({ action, actionType, args, modelName, info, params });
    const response = apiConvertorOutput[info.interface]({ data, metadata });
    return response;
  };
};

const apiConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  graphql({ data, metadata }) {
    if (data instanceof Array) {
      return data.map(datum => Object.assign({}, datum, { __metadata: metadata }));
    } else {
      return Object.assign({}, data, { __metadata: metadata });
    }
  },

};


module.exports = {
  apiConvertor,
};
