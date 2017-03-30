'use strict';


const databaseConvertor = async function () {
  return async function (input) {
    const { database: { operation, args } } = input;
    const response = await this.next({ operation, args });
    return response;
  };
};


module.exports = {
  databaseConvertor,
};