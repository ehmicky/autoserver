'use strict';


const handleJsl = async function () {
  return await function (input) {
    //console.log(input.action, input.args, input.modelName, input.info);
    const response = this.next(input);
    return response;
  };
};


module.exports = {
  handleJsl,
};
