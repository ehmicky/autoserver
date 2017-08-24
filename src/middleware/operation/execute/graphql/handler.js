'use strict';

const { getContent } = require('./content');
const { getActionOutputInfo } = require('./action_info');

// GraphQL query handling
const executeGraphql = async function (mInput, nextLayer) {
  // Unfortunately, the library we use for GraphQL parsing does not allow
  // to retrieve the input of each resolver, so we need to introduce a
  // mutable variable `responses` to collect them
  const responses = [];

  // GraphQL execution
  const content = await getContent({ nextLayer, mInput, responses });

  const { response } = parseResult({ content, responses });

  const { actionsInfo } = getActionOutputInfo({ responses });

  return { response, actionsInfo };
};

const parseResult = function ({ content, responses }) {
  const type = getResponseType({ content });

  const actions = responses.map(({ response: { action } }) => action);

  return { response: { content, type, actions } };
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
