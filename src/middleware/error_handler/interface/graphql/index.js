'use strict';


const createError = function ({ error }) {
  return error;
};


module.exports = {
  graphql: {
    createError,
  },
};
