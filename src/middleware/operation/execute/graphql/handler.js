'use strict';

const { deepMerge, makeImmutable } = require('../../../../utilities');

const { getContent } = require('./content');

// GraphQL query handling
const executeGraphql = async function (nextFunc, input) {
  // GraphQL execution
  const actions = [];
  const measures = [];
  const logs = [];
  const [content, currentPerf] = await getContent({
    nextFunc,
    input,
    actions,
    measures,
    logs,
  });
  const type = getResponseType({ content });

  makeImmutable(actions);

  const log = logs.length === 0 ? undefined : deepMerge({}, ...logs);

  const response = { content, type, actions, measures, log, currentPerf };
  return response;
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
