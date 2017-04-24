'use strict';


const handleJsl = async function () {
  return await function (input) {
    const response = this.next(input);
    return response;
  };
};


module.exports = {
  handleJsl,
};
