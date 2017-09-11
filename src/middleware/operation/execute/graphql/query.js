'use strict';

const { parseActions } = require('./parse_actions');
const { fireResolvers } = require('./fire_resolver');
const { selectFields } = require('./select');
const { assemble } = require('./assemble');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  operationName,
  goal,
  cbFunc,
  variables,
}) {
  const actions = parseActions({
    queryDocument,
    operationName,
    goal,
    variables,
  });

  const actionsA = await fireResolvers({ actions, cbFunc, resolver });

  const actionsB = selectFields({ actions: actionsA });

  const actionsC = assemble({ actions: actionsB });
  return actionsC;
};

module.exports = {
  handleQuery,
};
