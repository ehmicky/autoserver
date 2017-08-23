'use strict';

const { getContent } = require('./content');
const { addActionOutputInfo } = require('./action_info');

// GraphQL query handling
const executeGraphql = async function (input, nextLayer) {
  // Unfortunately, the library we use for GraphQL parsing does not allow
  // to retrieve the input of each resolver, so we need to introduce a
  // mutable variable `responses` to collect them
  const responses = [];

  // GraphQL execution
  const content = await getContent({ nextLayer, input, responses });

  const inputA = addActionOutputInfo({ input, responses });

  const inputB = parseResult({ input: inputA, content, responses });

  return inputB;
};

const parseResult = function ({ input, content, responses }) {
  const type = getResponseType({ content });

  const actions = responses.map(({ response: { action } }) => action);

  return { ...input, response: { content, type, actions } };
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
