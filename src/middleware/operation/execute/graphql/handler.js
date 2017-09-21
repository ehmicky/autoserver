'use strict';

const { getGraphQLInput } = require('./input');
const { getMainDef } = require('./main_def');
const { parseActions } = require('./actions');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { getTopArgs } = require('./top_args');
const { parseDataArg } = require('./data_arg');
const { getOperationSummary } = require('./operation_summary');
const { sortActions } = require('./sort_actions');
const { addActionsGroups } = require('./actions_groups');
const { parseModels } = require('./models');
const { validateUnknownAttrs } = require('./unknown_attrs');
const { sequenceActions } = require('./sequencer');
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
    variables,
    operationName,
    queryDocument,
  } = getGraphQLInput({ queryVars, payload });
  const {
    mainDef,
    fragments,
  } = getMainDef({ queryDocument, operationName, method });
  const actions = parseActions({ mainDef, fragments, variables });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ actions })) {
    return handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
  }

  const actionsA = parseModels({ actions, modelsMap });
  validateUnknownAttrs({ actions: actionsA, modelsMap });

  const topArgs = getTopArgs({ actions: actionsA });
  const actionsB = parseDataArg({ actions: actionsA, modelsMap });
  const operationSummary = getOperationSummary({ actions: actionsB });
  const actionsC = sortActions({ actions: actionsB });
  const actionsGroups = addActionsGroups({ actions: actionsC });

  const responses = await sequenceActions({
    actionsGroups,
    nextLayer,
    otherLayer,
    mInput,
    topArgs,
  });

  const responsesA = removeNestedWrite({ responses });
  const responsesB = sortResponses({ responses: responsesA });

  const fullResponse = assembleResponses({ responses: responsesB });
  const fullResponseA = selectFields({ fullResponse, responses: responsesB });
  const fullResponseB = parseResponse({ fullResponse: fullResponseA });

  return { response: fullResponseB, topArgs, operationSummary };
};

const otherLayer = async function ({
  actionsGroupType,
  actions,
  nextLayer,
  mInput,
  responses,
}) {
  const responsesA = await resolveActions({
    actionsGroupType,
    actions,
    nextLayer,
    mInput,
    responses,
  });
  return responsesA;
};

module.exports = {
  executeGraphql,
};
