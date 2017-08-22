'use strict';

const { getContent } = require('./content');

// GraphQL query handling
const executeGraphql = async function (input, nextLayer) {
  // Unfortunately, the library we use for GraphQL parsing does not allow
  // to retrieve the input of each resolver, so we need to introduce a
  // mutable variable `responses` to collect them
  const responses = [];

  // GraphQL execution
  const content = await getContent({ nextLayer, input, responses });

  const parsedResult = parseResult({ content, responses });

  const response = { content, ...parsedResult };
  return { ...input, response };
};

const parseResult = function ({ content, responses }) {
  const type = getResponseType({ content });

  const actions = responses.map(({ action }) => action);

  return { type, actions };
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
