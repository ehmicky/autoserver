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
const { resolveActions } = require('./resolver');
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

  const operationSummary = getOperationSummary({ actions: actionsB });

  const actionsC = sortActions({ actions: actionsB });

  const actionsD = await resolveActions({
    actions: actionsC,
    nextLayer,
    mInput,
  });
  console.log(JSON.stringify(actionsD, null, 2));

  const actionsE = removeNestedWrite({ actions: actionsD });

  const responseData = assembleActions({ actions: actionsE });

  const responseDataA = selectFields({ responseData, actions: actionsE });

  const response = parseResponse({
    responseData: responseDataA,
    actions: actionsE,
  });

  return { response, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
