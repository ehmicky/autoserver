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
const { parseOrderBy } = require('./order_by');
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
const { getModelsCount } = require('./models_count');
const { assembleResponses } = require('./assemble');
const { selectFields } = require('./select');
const { applySilent } = require('./silent');
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
    protocolArgs,
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

  const top = parseTopAction({ operation, modelsMap, protocolArgs });
  const actions = normalizeActions({ operation });

  const actionsA = parseModels({ actions, top, modelsMap });
  const actionsB = handleArgs({ actions: actionsA, top, runOpts, idl });
  const actionsC = parseDataArg({ actions: actionsB, top, modelsMap });
  const actionsD = parseCascade({ actions: actionsC, top, modelsMap });
  const actionsE = parseOrderBy({ actions: actionsD });
  validateUnknownAttrs({ actions: actionsE, modelsMap });
  const operationSummary = getOperationSummary({ actions: actionsE, top });
  const actionsF = sortActions({ actions: actionsE });

  const actionsG = await addCurrentData({
    actions: actionsF,
    top,
    modelsMap,
    nextLayer,
    otherLayer,
    mInput,
  });
  const actionsH = mergeUpdateData({ actions: actionsG, top });
  const responses = await resolveWriteActions({
    actions: actionsH,
    top,
    nextLayer,
    otherLayer,
    mInput,
  });
  const responsesA = await resolveReadActions({
    actions: actionsH,
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
  const { modelsCount, uniqueModelsCount } = getModelsCount({
    responses: responsesD,
  });

  const fullResponse = assembleResponses({ responses: responsesD });
  const fullResponseA = selectFields({ fullResponse, responses: responsesD });
  const fullResponseB = parseResponse({ fullResponse: fullResponseA });
  const fullResponseC = applySilent({ fullResponse: fullResponseB, top });

  return {
    response: fullResponseC,
    topArgs: top.args,
    operationSummary,
    modelsCount,
    uniqueModelsCount,
  };
};

const otherLayer = function (obj) {
  return resolveActions(obj);
};

module.exports = {
  executeGraphql,
};
