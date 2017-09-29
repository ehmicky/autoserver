'use strict';

const { assignArray } = require('../../../utilities');

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const mergeUpdateData = function ({
  actions,
  top: { actionConstant: { type: actionType } },
}) {
  if (actionType !== 'update') { return { actions }; }

  const updateActions = actions
    .filter(({ actionConstant }) => actionConstant.type === 'update');
  const partialData = mergePartialData({ actions: updateActions });
  const actionsA = updateActions
    .map(action => mergeData({ action, partialData }));

  return { actions: actionsA };
};

// Several actions might target the same model, but with different args.data
// We merge all the args.data here, with priority to the children.
const mergePartialData = function ({ actions }) {
  return actions
    .map(getPartialDataById)
    .reduce(assignArray, [])
    .reduce(assignArray, [])
    .reduce(reducePartialData, {});
};

// Group args.data according to currentData `id`
const getPartialDataById = function ({
  args: { data: [data] },
  modelName,
  currentData,
}) {
  return currentData
    .map(({ id }) => ({ key: `${modelName} ${id}`, data }));
};

const reducePartialData = function (dataObj, { key, data }) {
  const { [key]: dataA } = dataObj;

  // Merges `args.data` with each other
  const dataB = { ...dataA, ...data };

  return { ...dataObj, [key]: dataB };
};

const mergeData = function ({
  action,
  action: { args, modelName, currentData },
  partialData,
}) {
  const data = currentData.map(currentDatum => {
    const partialDatum = partialData[`${modelName} ${currentDatum.id}`];
    // Merges `args.data` with `currentData`
    return { ...currentDatum, ...partialDatum };
  });

  return { ...action, args: { ...args, data } };
};

module.exports = {
  mergeUpdateData,
};
