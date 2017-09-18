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
const { sortActions } = require('./sort');
const { parseModels } = require('./models');
const { addRespPathsIds } = require('./resp_paths_id');
const { fireResolvers } = require('./resolver');
const { removeNestedWrite } = require('./remove_nested_write');
const { assembleActions } = require('./assemble');
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

  const operationSummary = getOperationSummary({ actions: actionsB });

  const actionsC = sortActions({ actions: actionsB });

  const actionsD = addRespPathsIds({ actions: actionsC });

  const actionsE = await fireResolvers({
    actions: actionsD,
    nextLayer,
    mInput,
  });

  const actionsF = removeNestedWrite({ actions: actionsE });

  const responseData = assembleActions({ actions: actionsF });
  console.log(JSON.stringify(responseData, null, 2));

  const response = parseResponse({
    responseData,
    actions: actionsF,
  });

  return { response, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
