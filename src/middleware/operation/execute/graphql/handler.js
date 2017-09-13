'use strict';

const { getGraphQLInput } = require('./input');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getMainDef, getFragments } = require('./top_level');
const { parseActions } = require('./actions');
const { getTopArgs } = require('./top_args');
const { addNestedWrite } = require('./add_nested_write');
const { getOperationSummary } = require('./operation_summary');
const { parseModels } = require('./models');
const { fireResolvers } = require('./resolver');
const { removeNestedWrite } = require('./remove_nested_write');
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

  const topArgs = getTopArgs({ actions });

  const actionsA = parseModels({ actions, modelsMap });

  const actionsB = addNestedWrite({ actions: actionsA, modelsMap });
  console.log(JSON.stringify(actionsB, null, 2));

  const operationSummary = getOperationSummary({ actions: actionsB });

  const actionsC = await fireResolvers({
    actions: actionsB,
    nextLayer,
    mInput,
  });

  const actionsD = removeNestedWrite({ actions: actionsC });

  const responseData = assembleActions({ actions: actionsD });

  const responseDataA = selectFields({ responseData, actions: actionsD });

  const response = parseResponse({
    responseData: responseDataA,
    actions: actionsD,
  });

  return { response, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
