'use strict';

const parseResult = function ({ data, responses }) {
  const type = getResponseType({ data });

  const actions = responses.map(({ response: { action } }) => action);

  return { response: { content: { data }, type, actions } };
};

const getResponseType = function ({ data }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  parseResult,
};
