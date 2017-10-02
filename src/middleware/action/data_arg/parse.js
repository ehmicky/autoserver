'use strict';

const { getNestedKeys, getNestedActions } = require('./nested');
const { getWriteAction } = require('./write_action');
const { validateData } = require('./validate');

// Parse an object (including its children) inside `args.data`
// as a set of write actions
const parseData = function ({ data, ...rest }) {
  const dataA = normalizeData({ data });

  dataA.forEach(datum => validateData({ data: datum, ...rest }));

  const nestedKeys = getNestedKeys({ data: dataA, ...rest });
  const nestedActions = getNestedActions({
    parseData,
    data: dataA,
    nestedKeys,
    ...rest,
  });
  const action = getWriteAction({ data: dataA, nestedKeys, ...rest });
  const actionA = filterAction({ action });
  return [...actionA, ...nestedActions];
};

// Commands are normalized to being only multiple
// So we also normalize `args.data` to always be an array
const normalizeData = function ({ data }) {
  return Array.isArray(data) ? data : [data];
};

// Do not create actions with empty `args.data`
const filterAction = function ({ action, action: { args: { data } } }) {
  const isEmptyAction = data.length === 0;
  if (isEmptyAction) { return []; }

  return [action];
};

module.exports = {
  parseData,
};
