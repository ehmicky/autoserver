'use strict';

const { assignArray } = require('../../utilities');

// Merge `currentData` with the `args.data` in `patch` commands,
// to obtain the final models we want to use as replacement
const patchData = function ({ actions, top: { command } }) {
  if (command.type !== 'patch') { return; }

  const partialData = mergePartialData({ actions });
  const actionsA = actions.map(action => mergeData({ action, partialData }));

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

// Merges `args.data` with `currentData`
const mergeData = function ({
  action,
  action: { args, modelName, currentData },
  partialData,
}) {
  const data = currentData.map(currentDatum => {
    const partialDatum = partialData[`${modelName} ${currentDatum.id}`];
    return { ...currentDatum, ...partialDatum };
  });

  return { ...action, args: { ...args, data } };
};

module.exports = {
  patchData,
};
