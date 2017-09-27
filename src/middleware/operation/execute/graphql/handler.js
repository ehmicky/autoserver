'use strict';

const { getGraphQLInput } = require('./input');
const { getMainDef } = require('./main_def');
const { parseOperation } = require('./operation');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { parseTopAction } = require('./top_action');
const { normalizeActions } = require('./normalize');
const { parseModels } = require('./models');
const { handleArgs } = require('./handle_args');
const { parseDataArg } = require('./data_arg');
const { parseCascade } = require('./cascade');
const { validateUnknownAttrs } = require('./unknown_attrs');
const { getOperationSummary } = require('./operation_summary');
const { sortActions } = require('./sort_actions');
const { addCurrentData } = require('./current_data');
const { mergeUpdateData } = require('./update_data');
const { resolveWriteActions } = require('./write_actions');
const { resolveReadActions } = require('./read_actions');
const { resolveActions } = require('./resolver');
const { removeNestedWrite } = require('./remove_nested_write');
const { removeDuplicateResponses } = require('./duplicate_responses');
const { sortResponses } = require('./sort_responses');
const { assembleResponses } = require('./assemble');
const { selectFields } = require('./select');
const { parseResponse } = require('./response');

// GraphQL query handling
const executeGraphql = async function (
  {
    idl,
    idl: { GraphQLSchema: schema, shortcuts: { modelsMap } },
    runOpts,
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
  const operation = parseOperation({ mainDef, fragments, variables });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ operation })) {
    return handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
  }

  const top = parseTopAction({ operation, modelsMap });
  const actions = normalizeActions({ operation });

  const actionsA = parseModels({ actions, top, modelsMap });
  const actionsB = handleArgs({ actions: actionsA, top, runOpts, idl });
  const actionsC = parseDataArg({ actions: actionsB, top, modelsMap });
  const actionsD = parseCascade({ actions: actionsC, top, modelsMap });
  validateUnknownAttrs({ actions: actionsD, modelsMap });
  const operationSummary = getOperationSummary({ actions: actionsD, top });
  const actionsE = sortActions({ actions: actionsD });

  const actionsF = await addCurrentData({
    actions: actionsE,
    top,
    modelsMap,
    nextLayer,
    otherLayer,
    mInput,
  });
  const actionsG = mergeUpdateData({ actions: actionsF, top });
  const responses = await resolveWriteActions({
    actions: actionsG,
    nextLayer,
    otherLayer,
    mInput,
  });
  const responsesA = await resolveReadActions({
    actions: actionsG,
    top,
    modelsMap,
    nextLayer,
    otherLayer,
    mInput,
    responses,
  });

  const responsesB = removeNestedWrite({ responses: responsesA });
  const responsesC = removeDuplicateResponses({ responses: responsesB });
  const responsesD = sortResponses({ responses: responsesC });

  const fullResponse = assembleResponses({ responses: responsesD });
  const fullResponseA = selectFields({ fullResponse, responses: responsesD });
  const fullResponseB = parseResponse({ fullResponse: fullResponseA });

  return { response: fullResponseB, topArgs: top.args, operationSummary };
};

const otherLayer = function (obj) {
  return resolveActions(obj);
};

module.exports = {
  executeGraphql,
};
