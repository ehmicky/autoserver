'use strict';


const databaseConvertor = async function () {
  return async function (input) {
    const { database: { operation, args, modelName } } = input;
    const response = await this.next({ operation, args, modelName });
    return response;
  };
};


module.exports = {
  databaseConvertor,
};