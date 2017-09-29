'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../../utilities');
const { throwError } = require('../../error');

const validateUnknownAttrs = function ({
  actions,
  idl: { shortcuts: { modelsMap } },
}) {
  actions.forEach(action => validateAction({ action, modelsMap }));
  return actions;
};

const validateAction = function ({ action, modelsMap }) {
  validateAllAttr({ action, modelsMap });
  validateUnknown({ action, modelsMap });
};

const validateAllAttr = function ({
  action: { select = [], actionPath, modelName },
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
  argsToValidate.forEach(({ name, getKeys }) => {
    const keys = getKeys({ action });
    validateUnknownArg({ keys, action, modelsMap, name });
  });
};

const getSelectKeys = function ({ action: { select = [] } }) {
  return select
    .filter(({ key }) => key !== 'all')
    .map(({ key }) => key);
};

const getDataKeys = function ({ action: { args: { data = [] } } }) {
  return getUniqueKeys(data);
};

const getFilterKeys = function ({ action: { args: { filter = [] } } }) {
  const filterA = Array.isArray(filter) ? filter : [filter];
  return getUniqueKeys(filterA);
};

const getUniqueKeys = function (array) {
  const keys = array
    .map(Object.keys)
    .reduce(assignArray, []);
  const keysA = uniq(keys);
  return keysA;
};

const getOrderByKeys = function ({ action: { args: { orderBy = [] } } }) {
  return orderBy.map(({ attrName }) => attrName);
};

const argsToValidate = [
  { name: 'select', getKeys: getSelectKeys },
  { name: 'data', getKeys: getDataKeys },
  { name: 'filter', getKeys: getFilterKeys },
  { name: 'order_by', getKeys: getOrderByKeys },
];

const validateUnknownArg = function ({
  keys,
  action: { actionPath, modelName },
  modelsMap,
  name,
}) {
  const keyA = keys.find(key => modelsMap[modelName][key] === undefined);
  if (keyA === undefined) { return; }

  const path = [...actionPath, keyA]
    .slice(1)
    .join('.');
  const message = `In argument '${name}', attribute '${path}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
