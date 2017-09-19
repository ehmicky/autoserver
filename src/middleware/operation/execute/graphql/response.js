'use strict';

const parseResponse = function ({ fullResponse }) {
  const type = getResponseType({ fullResponse });

  return {
    content: { data: fullResponse },
    type,
  };
};

const getResponseType = function ({ fullResponse }) {
  const mainData = fullResponse[Object.keys(fullResponse)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
