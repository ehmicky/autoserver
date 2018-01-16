'use strict';

const { flatten, uniq } = require('../../utilities');
const { throwError } = require('../../errors');

// Validate that attributes in `args.select|data|order` are in the
// config.
// Also validate special key 'all'
// `args.cascade` is not validated because already previously checked.
const validateUnknownAttrs = function ({ actions, config }) {
  actions.forEach(action => validateAction({ action, config }));
};

const validateAction = function ({ action, config }) {
  validateAllAttr({ action, config });
  validateUnknown({ action, config });
};

// Validate correct usage of special key 'all'
const validateAllAttr = function ({
  action: { args: { select }, collname },
  config: { collections },
}) {
  if (select === undefined) { return; }

  const hasAllAttr = select.some(key => key === 'all');
  if (!hasAllAttr) { return; }

  const keyA = select
    .filter(key => key !== 'all')
    .find(key => collections[collname].attributes[key].target === undefined);
  if (keyA === undefined) { return; }

  const message = `Argument 'select' cannot target both 'all' and '${keyA}' attributes`;
  throwError(message, { reason: 'VALIDATION' });
};

// Validate that arguments's attributes are present in config
const validateUnknown = function ({ action, config }) {
  argsToValidate.forEach(({ name, getKeys }) => {
    const keys = getKeys({ action });
    validateUnknownArg({ keys, action, config, name });
  });
};

const getSelectKeys = function ({ action: { args: { select = [] } } }) {
  return select.filter(key => key !== 'all');
};

const getRenameKeys = function ({ action: { args: { rename = [] } } }) {
  return rename.map(({ key }) => key);
};

// Turn e.g. [{ a, b }, { a }] into ['a', 'b']
const getDataKeys = function ({ action: { args: { data = [] } } }) {
  const keys = data.map(Object.keys);
  const keysA = flatten(keys);
  const keysB = uniq(keysA);
  return keysB;
};

const getOrderKeys = function ({ action: { args: { order = [] } } }) {
  return order.map(({ attrName }) => attrName);
};

// Each argument type has its own way or specifying attributes
const argsToValidate = [
  { name: 'select', getKeys: getSelectKeys },
  { name: 'rename', getKeys: getRenameKeys },
  { name: 'data', getKeys: getDataKeys },
  { name: 'order', getKeys: getOrderKeys },
];

const validateUnknownArg = function ({
  keys,
  action: { commandpath, collname },
  config: { collections },
  name,
}) {
  const keyA = keys
    .find(key => collections[collname].attributes[key] === undefined);
  if (keyA === undefined) { return; }

  const path = [...commandpath, keyA].join('.');
  const message = `In '${name}' argument, attribute '${path}' is unknown`;
  throwError(message, { reason: 'VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
