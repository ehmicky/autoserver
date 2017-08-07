'use strict';

// GraphQL-specific way to apply `nooutput`
const nooutput = function (response) {
  return { ...response, content: { ...response.content, data: {} } };
};

module.exports = {
  GraphQL: {
    nooutput,
  },
};
