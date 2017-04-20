'use strict';


const processResponse = function ({ response: { status, error: { description, details, status: errStatus, type, title } } }) {
  return {
    status,
    contentType: 'application/json',
    error: {
      errors: [{
        message: description,
        // TODO
        // locations
        stack: details,
        status: errStatus,
        type,
        title,
      }],
    },
  };
};


module.exports = {
  graphql: {
    processResponse,
  },
};
