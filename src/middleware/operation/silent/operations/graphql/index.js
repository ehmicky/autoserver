'use strict';

// GraphQL-specific way to apply `silent`
const silent = function (response) {
  return { ...response, content: { ...response.content, data: {} } };
};

module.exports = {
  GraphQL: {
    silent,
  },
};
