'use strict';

const { getGraphQLInput } = require('./input');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getMainDef, getFragments } = require('./top_level');
const { parseActions } = require('./actions');
const { augmentActions } = require('./augment');
const { getSummary } = require('./summary');
const { parseModels } = require('./models');
const { fireResolvers } = require('./resolver');
const { assembleActions } = require('./assemble');
const { selectFields } = require('./select');
const { parseResponse } = require('./response');

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

  const actionsA = augmentActions({ actions });

  const actionsB = parseModels({ actions: actionsA, modelsMap });
  const { topArgs, operationSummary } = getSummary({ actions: actionsB });

  const actionsC = await fireResolvers({
    actions: actionsB,
    nextLayer,
    mInput,
  });

  const responseData = assembleActions({ actions: actionsC });

  const responseDataA = selectFields({ responseData, actions: actionsC });

  const response = parseResponse({
    responseData: responseDataA,
    actions: actionsC,
  });

  return { response, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
