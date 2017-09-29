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
const { removeNestedWrite } = require('./remove_nested_write');
const { removeDuplicateResults } = require('./duplicate_results');
const { sortResults } = require('./sort_results');
const { getModelsCount } = require('./models_count');
const { assembleResults } = require('./assemble');
const { selectFields } = require('./select');
const { parseResponse } = require('./parse_response');

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

  const actionsH = await addCurrentData(
    { actions: actionsG, top, modelsMap, mInput },
    nextLayer,
  );
  const actionsI = mergeUpdateData({ actions: actionsH, top });
  const results = await resolveWriteActions(
    { actions: actionsI, top, mInput },
    nextLayer,
  );
  const resultsA = await resolveReadActions(
    { actions: actionsI, top, modelsMap, mInput, results },
    nextLayer,
  );

  const resultsB = removeNestedWrite({ results: resultsA });
  const resultsC = removeDuplicateResults({ results: resultsB });
  const resultsD = sortResults({ results: resultsC });
  const { modelsCount, uniqueModelsCount } = getModelsCount({
    results: resultsD,
  });

  const response = assembleResults({ results: resultsD });
  const responseA = selectFields({ response, results: resultsD });
  const responseB = parseResponse({ response: responseA });

  return {
    response: responseB,
    topArgs: top.args,
    operationSummary,
    modelsCount,
    uniqueModelsCount,
  };
};

module.exports = {
  actionHandling,
};
