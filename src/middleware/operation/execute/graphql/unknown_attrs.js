'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../../../../utilities');
const { throwError } = require('../../../../error');

const validateUnknownAttrs = function ({ actions, modelsMap }) {
  actions.forEach(action => validateAction({ action, modelsMap }));
  return actions;
};

const validateAction = function ({ action, modelsMap }) {
  validateAllAttr({ action, modelsMap });
  validateUnknown({ action, modelsMap });
};

const validateAllAttr = function ({
  action: { select, actionPath, modelName },
  modelsMap,
}) {
  const hasAllAttr = select.some(({ key }) => key === 'all');
  if (!hasAllAttr) { return; }

  const attr = select
    .filter(({ key }) => key !== 'all')
    .find(({ key }) => modelsMap[modelName][key].target === undefined);
  if (attr === undefined) { return; }

  const path = actionPath.join('.');
  const message = `At '${path}': cannot specify both 'all' and '${attr.key}' attributes`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateUnknown = function ({ action, modelsMap }) {
  const selectKeys = getSelectKeys({ action });
  validateSingleUnknown({ keys: selectKeys, action, modelsMap });

  const dataKeys = getDataKeys({ action });
  validateSingleUnknown({ keys: dataKeys, action, modelsMap });
};

const getSelectKeys = function ({ action: { select } }) {
  return select
    .filter(({ key }) => key !== 'all')
    .map(({ key }) => key);
};

const getDataKeys = function ({ action: { args: { data } } }) {
  if (data === undefined) { return []; }

  const keys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const keysA = uniq(keys);
  return keysA;
};

const validateSingleUnknown = function ({
  keys,
  action: { actionPath, modelName },
  modelsMap,
}) {
  const keyA = keys.find(key => modelsMap[modelName][key] === undefined);
  if (keyA === undefined) { return; }

  const path = [...actionPath, keyA].join('.');
  const message = `Attribute '${path}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
