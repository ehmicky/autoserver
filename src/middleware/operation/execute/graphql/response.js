'use strict';

const { set } = require('../../../../utilities');

const parseResponse = function ({ actions }) {
  const data = assembleActions({ actions });
  const type = getResponseType({ data });
  const actionConstants = actions.map(({ actionConstant }) => actionConstant);

  return {
    content: { data },
    type,
    actions: actionConstants,
  };
};

const assembleActions = function ({ actions }) {
  return actions.reduce(
    (response, { data, actionPath }) => set(response, actionPath, data),
    {},
  );
};

const getResponseType = function ({ data }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
