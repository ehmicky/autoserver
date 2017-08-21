'use strict';

const { getContent } = require('./content');

// GraphQL query handling
const executeGraphql = async function (nextFunc, input) {
  // Unfortunately, the library we use for GraphQL parsing does not allow
  // to retrieve the input of each resolver, so we need to introduce a
  // mutable variable `responses` to collect them
  const responses = [];

  // GraphQL execution
  const [content, currentPerf] = await getContent({
    nextFunc,
    input,
    responses,
  });

  const parsedResult = parseResult({ content, responses });

  const response = { content, currentPerf, ...parsedResult };
  return { ...input, response };
};

const parseResult = function ({ content, responses }) {
  const type = getResponseType({ content });

  const actions = responses.map(({ action }) => action);

  const measures = responses.reduce(
    (measuresA, { measures: newMeasures }) => [...measuresA, ...newMeasures],
    [],
  );

  return { type, actions, measures };
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
