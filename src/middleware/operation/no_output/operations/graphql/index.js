'use strict';

// GraphQL-specific way to apply `noOutput`
const noOutput = function (response) {
  return { ...response, content: { ...response.content, data: {} } };
};

module.exports = {
  GraphQL: {
    noOutput,
  },
};
