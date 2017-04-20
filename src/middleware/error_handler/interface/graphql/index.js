'use strict';


const processError = function ({ error }) {
  return error;
};


module.exports = {
  graphql: {
    processError,
  },
};
