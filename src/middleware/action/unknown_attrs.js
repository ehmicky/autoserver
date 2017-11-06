'use strict';

const { assignArray, uniq } = require('../../utilities');
const { throwError } = require('../../error');

// Validate that attributes in `args.select|data|order_by` are in the
// schema.
// Also validate special key 'all'
// `args.cascade` is not validated because already previously checked.
const validateUnknownAttrs = function ({
  actions,
  schema: { shortcuts: { modelsMap } },
}) {
  actions.forEach(action => validateAction({ action, modelsMap }));
};

const validateAction = function ({ action, modelsMap }) {
  validateAllAttr({ action, modelsMap });
  validateUnknown({ action, modelsMap });
};

// Validate correct usage of special key 'all'
const validateAllAttr = function ({
  action: { select, commandpath, modelName },
  modelsMap,
}) {
  if (select === undefined) { return; }

  const hasAllAttr = select.some(({ key }) => key === 'all');
  if (!hasAllAttr) { return; }

  const attr = select
    .filter(({ key }) => key !== 'all')
    .find(({ key }) => modelsMap[modelName][key].target === undefined);
  if (attr === undefined) { return; }

  const message = `At '${commandpath.join('.')}': cannot specify both 'all' and '${attr.key}' attributes`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Validate that arguments's attributes are present in schema
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

// Turn e.g. [{ a, b }, { a }] into ['a', 'b']
const getDataKeys = function ({ action: { args: { data = [] } } }) {
  const keys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const keysA = uniq(keys);
  return keysA;
};

const getOrderByKeys = function ({ action: { args: { orderBy = [] } } }) {
  return orderBy.map(({ attrName }) => attrName);
};

// Each argument type has its own way or specifying attributes
const argsToValidate = [
  { name: 'select', getKeys: getSelectKeys },
  { name: 'data', getKeys: getDataKeys },
  { name: 'order_by', getKeys: getOrderByKeys },
];

const validateUnknownArg = function ({
  keys,
  action: { commandpath, modelName },
  modelsMap,
  name,
}) {
  const keyA = keys.find(key => modelsMap[modelName][key] === undefined);
  if (keyA === undefined) { return; }

  const path = [...commandpath.slice(1), keyA].join('.');
  const message = `In argument '${name}', attribute '${path}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
