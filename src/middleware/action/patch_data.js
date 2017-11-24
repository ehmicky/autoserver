'use strict';

const { flatten, groupBy, mapValues } = require('../../utilities');
const { applyPatchOps } = require('../../patch');

// Merge `currentData` with the `args.data` in `patch` commands,
// to obtain the final models we want to use as replacement
const patchData = function ({ actions, top: { command } }) {
  if (command.type !== 'patch') { return; }

  const dataMap = mergePartialData({ actions });
  const actionsA = actions.map(action => addData({ action, dataMap }));

  return { actions: actionsA };
};

// Merge `currentData` with `args.data`
const mergePartialData = function ({ actions }) {
  const actionsA = flattenActions({ actions });
  const dataMap = groupBy(actionsA, getActionKey);
  const dataMapA = mapValues(dataMap, mergeDatum);
  return dataMapA;
};

// Flatten `action.data` and `action.currentData` together
const flattenActions = function ({ actions }) {
  const actionsA = actions.map(flattenAction);
  const actionsB = flatten(actionsA);
  return actionsB;
};

const flattenAction = function ({
  currentData,
  args: { data: [patchOps] },
  collname,
}) {
  return currentData
    .map(currentDatum => ({ patchOps, currentDatum, collname }));
};

// Group args.data according to currentData `id` and `collname`
const getActionKey = function ({ collname, currentDatum: { id } }) {
  return `${collname} ${id}`;
};

// Do the actual merging
const mergeDatum = function (actions) {
  const [{ currentDatum }] = actions;

  // Several actions might target the same model, but with different args.data
  // We merge all the args.data here, with priority to the children, then to the
  // next siblings.
  const datumA = actions.reduce(
    (datum, { patchOps }) => applyPatchOps({ datum, patchOps }),
    currentDatum,
  );
  return datumA;
};

// Add merged `args.data` to each action
const addData = function ({
  action,
  action: { args, collname, currentData },
  dataMap,
}) {
  const data = currentData.map(({ id }) => dataMap[`${collname} ${id}`]);
  return { ...action, args: { ...args, data } };
};

module.exports = {
  patchData,
};
