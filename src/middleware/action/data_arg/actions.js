'use strict';

const { getNestedKeys, getNestedActions } = require('./nested');
const { getWriteAction } = require('./write_action');

// Parse an object (including its children) inside `args.data`
// as a set of write actions
const parseActions = function ({ data, ...rest }) {
  const dataA = normalizeData({ data });

  const nestedKeys = getNestedKeys({ data: dataA, ...rest });
  // Pass `parseActions` for recursion
  const nestedActions = getNestedActions({
    parseActions,
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
  parseActions,
};
