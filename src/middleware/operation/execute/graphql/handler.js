'use strict';

const { getGraphQLInput } = require('./input');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getMainDef, getFragments } = require('./top_level');
const { parseActions } = require('./actions');
const { parseModels } = require('./models');
const { fireResolvers } = require('./resolver');
const { selectFields } = require('./select');
const { assemble } = require('./assemble');
const { parseResult } = require('./result');
const { getActionOutputInfo } = require('./action_info');

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
  const actionsA = parseModels({ actions, modelsMap });

  const responses = [];
  const actionsB = await fireResolvers({
    actions: actionsA,
    nextLayer,
    responses,
    mInput,
  });

  const actionsC = selectFields({ actions: actionsB });

  const data = assemble({ actions: actionsC });

  const { response } = parseResult({ data, responses });

  const { actionsInfo } = getActionOutputInfo({ responses });

  return { response, actionsInfo };
};

module.exports = {
  executeGraphql,
};
