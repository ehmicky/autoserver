'use strict';

// GraphQL-specific way to apply `noOutput`
const noOutput = function (response) {
  const data = {};
  const content = Object.assign({}, response.content, { data });
  return Object.assign({}, response, { content });
};

module.exports = {
  GraphQL: {
    noOutput,
  },
};
