'use strict';

const parseResponse = function ({ responseData, actions }) {
  const type = getResponseType({ responseData });
  const actionConstants = actions.map(({ actionConstant }) => actionConstant);

  return {
    content: { data: responseData },
    type,
    actions: actionConstants,
  };
};

const getResponseType = function ({ responseData }) {
  const mainData = responseData[Object.keys(responseData)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
