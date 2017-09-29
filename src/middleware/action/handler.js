'use strict';

const { parseTopAction } = require('./top_action');
const { normalizeActions } = require('./normalize');
const { parseModels } = require('./models');
const { validateArgs } = require('./validate_args');
const { renameArgs } = require('./rename_args');
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
  { idl, runOpts, mInput, protocolArgs, operationDef },
  nextLayer,
) {
  const { top } = parseTopAction({ operationDef, idl, protocolArgs });
  const { actions: actionsA } = normalizeActions({ operationDef });

  const { actions: actionsB } = parseModels({ actions: actionsA, top, idl });
  validateArgs({ actions: actionsB, top, runOpts, idl });
  const { actions: actionsC } = renameArgs({ actions: actionsB });
  const { actions: actionsD } = parseDataArg({ actions: actionsC, top, idl });
  const { actions: actionsE } = parseCascade({ actions: actionsD, top, idl });
  const { actions: actionsF } = parseOrderBy({ actions: actionsE });
  validateUnknownAttrs({ actions: actionsF, idl });
  const { operationSummary } = getOperationSummary({ actions: actionsF, top });
  const { actions: actionsG } = sortActions({ actions: actionsF });

  const { actions: actionsH } = await addCurrentData(
    { actions: actionsG, top, idl, mInput },
    nextLayer,
  );
  const { actions: actionsI } = mergeUpdateData({ actions: actionsH, top });
  const { results } = await resolveWriteActions(
    { actions: actionsI, top, mInput },
    nextLayer,
  );
  const { results: resultsA } = await resolveReadActions(
    { actions: actionsI, top, idl, mInput, results },
    nextLayer,
  );

  const { results: resultsB } = removeNestedWrite({ results: resultsA });
  const { results: resultsC } = removeDuplicateResults({ results: resultsB });
  const { results: resultsD } = sortResults({ results: resultsC });
  const { modelsCount, uniqueModelsCount } = getModelsCount({
    results: resultsD,
  });

  const { response } = assembleResults({ results: resultsD });
  const { response: responseA } = selectFields({ response, results: resultsD });
  const { response: responseB } = parseResponse({ response: responseA });

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
