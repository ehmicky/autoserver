'use strict';

const parseResult = function ({ data, actions }) {
  const type = getResponseType({ data });
  const actionConstants = actions.map(({ actionConstant }) => actionConstant);

  return {
    response: {
      content: { data },
      type,
      actions: actionConstants,
    },
  };
};

const getResponseType = function ({ data }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResult,
};
