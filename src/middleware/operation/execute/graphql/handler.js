'use strict';

const { getGraphQLInput } = require('./input');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getMainDef, getFragments } = require('./top_level');
const { parseActions } = require('./actions');
const { getSummary } = require('./summary');
const { parseModels } = require('./models');
const { fireResolvers } = require('./resolver');
const { selectFields } = require('./select');
const { assemble } = require('./assemble');
const { parseResult } = require('./result');

// GraphQL query handling
const executeGraphql = async function (
  {
    idl: { GraphQLSchema: schema, shortcuts: { modelsMap } },
    queryVars,
    payload,
    goal,
    mInput,
  },
  nextLayer,
) {
  const {
    query,
    variables,
    operationName,
    queryDocument,
  } = getGraphQLInput({ queryVars, payload });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ query })) {
    return handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
  }

  const { selectionSet } = getMainDef({ queryDocument, operationName, goal });

  const fragments = getFragments({ queryDocument });

  const { actions } = parseActions({ selectionSet, fragments, variables });
  const { topArgs, operationSummary } = getSummary({ actions });
  const actionsA = parseModels({ actions, modelsMap });

  const actionsB = await fireResolvers({
    actions: actionsA,
    nextLayer,
    mInput,
  });

  const actionsC = selectFields({ actions: actionsB });

  const data = assemble({ actions: actionsC });

  const { response } = parseResult({ data, actions: actionsC });

  return { response, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
