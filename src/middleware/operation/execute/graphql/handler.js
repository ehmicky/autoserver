'use strict';

const { getGraphQLInput } = require('./input');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getMainDef } = require('./top_level');
const { parseActions } = require('./actions');
const { getTopArgs } = require('./top_args');
const { parseNestedWrite } = require('./nested_write');
const { getOperationSummary } = require('./operation_summary');
const { sortActions } = require('./sort_actions');
const { addActionsGroups } = require('./actions_groups');
const { parseModels } = require('./models');
const { validateUnknownAttrs } = require('./unknown_attrs');
const { resolveActions } = require('./resolver');
const { removeNestedWrite } = require('./remove_nested_write');
const { sortResponses } = require('./sort_responses');
const { assembleResponses } = require('./assemble');
const { selectFields } = require('./select');
const { parseResponse } = require('./response');

// GraphQL query handling
const executeGraphql = async function (
  {
    idl: { GraphQLSchema: schema, shortcuts: { modelsMap } },
    queryVars,
    payload,
    mInput,
    method,
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

  const {
    mainDef,
    fragments,
  } = getMainDef({ queryDocument, operationName, method });
  const actions = parseActions({ mainDef, fragments, variables });
  const actionsA = parseModels({ actions, modelsMap });
  validateUnknownAttrs({ actions: actionsA, modelsMap });

  const topArgs = getTopArgs({ actions: actionsA });
  const actionsB = parseNestedWrite({ actions: actionsA, modelsMap });
  const operationSummary = getOperationSummary({ actions: actionsB });
  const actionsC = sortActions({ actions: actionsB });
  const actionsGroups = addActionsGroups({ actions: actionsC });

  const responses = await resolveActions({ actionsGroups, nextLayer, mInput });

  const responsesA = removeNestedWrite({ responses });
  const responsesB = sortResponses({ responses: responsesA });

  const fullResponse = assembleResponses({ responses: responsesB });
  const fullResponseA = selectFields({ fullResponse, responses: responsesB });
  const fullResponseB = parseResponse({ fullResponse: fullResponseA });

  return { response: fullResponseB, topArgs, operationSummary };
};

module.exports = {
  executeGraphql,
};
