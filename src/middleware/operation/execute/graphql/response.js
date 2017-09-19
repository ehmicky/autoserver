'use strict';

const parseResponse = function ({ responseData }) {
  const type = getResponseType({ responseData });

  return {
    content: { data: responseData },
    type,
  };
};

const getResponseType = function ({ responseData }) {
  const mainData = responseData[Object.keys(responseData)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
