'use strict';


const validation = async function () {
  return async function (input) {
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  validation,
};
