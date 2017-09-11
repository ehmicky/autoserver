'use strict';

const { parse } = require('./new_parser');
const { fireResolvers } = require('./fire_resolver');
const { selectFields } = require('./select');
const { assemble } = require('./assemble');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument: { definitions },
  mainDef: { selectionSet },
  cbFunc,
  variables = {},
}) {
  const fragments = definitions
    .filter(({ kind }) => kind === 'FragmentDefinition');

  const { actions } = parse({ selectionSet, fragments, variables });

  const actionsA = await fireResolvers({ actions, cbFunc, resolver });

  const actionsB = await selectFields({ actions: actionsA });

  const actionsC = await assemble({ actions: actionsB });
  return actionsC;
};

module.exports = {
  handleQuery,
};
