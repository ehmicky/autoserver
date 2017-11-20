'use strict';

const { flatten } = require('../../../utilities');

// When using `select=parent.child`, `select=parent` is implicity added,
// unless it was already selected, including by `select=all` or by specifying
// no `select` at that level
const addParentSelects = function ({ selects }) {
  const parentSelects = selects
    .map(select => getParentSelect({ select, selects }));
  const parentSelectsA = flatten(parentSelects);
  return [...selects, ...parentSelectsA];
};

const getParentSelect = function ({ select, selects }) {
  const parentSelect = select.replace(PARENT_SELECT_REGEXP, '');
  if (parentSelect === '') { return []; }

  const parentSelectA = parentSelect.split('.');
  const siblingsSelects = getSiblingsSelects({
    selects,
    parentSelect: parentSelectA,
  });

  const doesNotNeedParent = siblingsSelects.length === 0 ||
    hasAllParent({ selects: siblingsSelects });
  if (doesNotNeedParent) { return []; }

  return [parentSelectA.join('.')];
};

const getSiblingsSelects = function ({ selects, parentSelect }) {
  return selects
    .map(selectA => selectA.split('.'))
    .filter(selectA => selectA.length === parentSelect.length);
};

const hasAllParent = function ({ selects }) {
  return selects.some(selectA => selectA[selectA.length - 1] === 'all');
};

// Remove last select part, e.g. `parent.child` -> `parent`
const PARENT_SELECT_REGEXP = /\.?[^.]+$/;

module.exports = {
  addParentSelects,
};
