'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../error');

// `readonly` attributes should not be modified.
// When using a nested action in a 'replace' command, it is possible to
// modify the parent attribute by changing the nested model ids in `args.data`.
// This will cause confusion, so we validate this does not happen.
const validateNestedReadonly = function ({ actions, idl, top: { command } }) {
  if (command.type !== 'replace') { return; }

  actions.forEach(action => validateAction({ action, actions, idl }));
};

const validateAction = function ({
  action: { commandPath },
  actions,
  idl: { shortcuts: { readonlyMap } },
}) {
  // Only for nested actions
  if (commandPath.length <= 1) { return; }

  const parentPath = commandPath.slice(0, -1);
  const parentAction = actions
    .find(({ commandPath: parentPathA }) => isEqual(parentPath, parentPathA));
  const { modelName: parentModel } = parentAction;
  const attrName = commandPath[commandPath.length - 1];

  // Only for readonly attributes
  if (!readonlyMap[parentModel].includes(attrName)) { return; }

  const { args: { data: newData }, currentData, dataPaths } = parentAction;

  currentData.forEach((currentDatum, index) => validateDatum({
    currentDatum,
    newDatum: newData[index],
    dataPath: dataPaths[index],
    attrName,
  }));
};

const validateDatum = function ({
  currentDatum,
  newDatum,
  dataPath,
  attrName,
}) {
  const hasSameValue = isEqual(currentDatum[attrName], newDatum[attrName]);
  if (hasSameValue) { return; }

  const attrPath = dataPath.slice(1).join('.');
  const message = `In 'data' argument, attribute 'data.${attrPath}.${attrName}' cannot be set to '${newDatum[attrName]}' because it is readonly, and its current value is '${currentDatum[attrName]}'.`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateNestedReadonly,
};
