'use strict';

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
const { parseResponse } = require('./response');

const actionHandling = async function (
  {
    idl,
    idl: { shortcuts: { modelsMap } },
    runOpts,
    mInput,
    protocolArgs,
    operationDef,
  },
  nextLayer,
) {
  const top = parseTopAction({ operationDef, modelsMap, protocolArgs });
  const actionsA = normalizeActions({ operationDef });

  const actionsB = parseModels({ actions: actionsA, top, modelsMap });
  const actionsC = handleArgs({ actions: actionsB, top, runOpts, idl });
  const actionsD = parseDataArg({ actions: actionsC, top, modelsMap });
  const actionsE = parseCascade({ actions: actionsD, top, modelsMap });
  const actionsF = parseOrderBy({ actions: actionsE });
  validateUnknownAttrs({ actions: actionsF, modelsMap });
  const operationSummary = getOperationSummary({ actions: actionsF, top });
  const actionsG = sortActions({ actions: actionsF });

  const actionsH = await addCurrentData({
    actions: actionsG,
    top,
    modelsMap,
    nextLayer,
    otherLayer,
    mInput,
  });
  const actionsI = mergeUpdateData({ actions: actionsH, top });
  const responses = await resolveWriteActions({
    actions: actionsI,
    top,
    nextLayer,
    otherLayer,
    mInput,
  });
  const responsesA = await resolveReadActions({
    actions: actionsI,
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

  return {
    response: fullResponseB,
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
  actionHandling,
};
