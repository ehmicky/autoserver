'use strict';

const { assignArray } = require('../../../utilities');

// When specifying `child.*`, parent is added implicity if omitted
const addParentSelects = function ({ selects }) {
  const parentSelects = selects
    .map(select => getParentSelect({ select, selects }))
    .reduce(assignArray, []);
  return [...selects, ...parentSelects];
};

const getParentSelect = function ({ select, selects }) {
  const { parentPath, selectKey } = splitSelect({ select });
  if (parentPath === '') { return []; }

  const { parentSelects, hasParent } = checkSelects({
    selects,
    parentPath,
    selectKey,
  });
  if (hasParent) { return []; }

  const parentKey = parentSelects.length === 0 ? 'all' : selectKey;
  const parentSelect = { commandpath: parentPath, key: parentKey };

  // Recurse over further parents
  const parents = getParentSelect({ select: parentSelect, selects });

  return [parentSelect, ...parents];
};

const splitSelect = function ({ select }) {
  const parts = select.commandpath.split('.');
  const parentPath = parts.slice(0, -1).join('.');
  const selectKey = parts[parts.length - 1];

  return { parentPath, selectKey };
};

const checkSelects = function ({ selects, parentPath, selectKey }) {
  const parentSelects = selects
    .filter(({ commandpath }) => commandpath === parentPath);
  const hasParent = parentSelects
    .some(({ key }) => key === 'all' || key === selectKey);
  return { parentSelects, hasParent };
};

module.exports = {
  addParentSelects,
};
