'use strict';

const { throwError } = require('../../../../../errors');
const { flatten } = require('../../../../../utilities');

const { applyDirectives } = require('./directive');
const { mergeSelectRename } = require('./merge_select');

// Retrieve `rpcDef.args.select` using GraphQL selection sets
const parseSelects = function ({ args, ...input }) {
  const selectRename = parseSelectionSet(input);

  const selectA = mergeSelectRename({ selectRename, name: 'select' });
  const renameA = mergeSelectRename({ selectRename, name: 'rename' });

  return { ...args, select: selectA, rename: renameA };
};

const parseSelectionSet = function ({
  selectionSet,
  parentPath = [],
  variables,
  fragments,
}) {
  if (selectionSet == null) { return []; }

  const select = selectionSet.selections
    .filter(selection => applyDirectives({ selection, variables }))
    .map(parseSelection.bind(null, { parentPath, variables, fragments }));
  const selectA = flatten(select);
  return selectA;
};

const parseSelection = function (
  { parentPath, variables, fragments },
  { name: { value: fieldName } = {}, alias, selectionSet, kind },
) {
  return parsers[kind]({
    fieldName,
    alias,
    selectionSet,
    parentPath,
    variables,
    fragments,
  });
};

const parseField = function ({
  fieldName,
  alias,
  selectionSet,
  parentPath,
  variables,
  fragments,
}) {
  const selectRename = getSelectRename({ parentPath, alias, fieldName });

  const childSelectRename = parseSelectionSet({
    selectionSet,
    parentPath: [...parentPath, fieldName],
    variables,
    fragments,
  });

  return [selectRename, ...childSelectRename];
};

const getSelectRename = function ({ parentPath, alias, fieldName }) {
  const select = [...parentPath, fieldName].join('.');
  const outputName = alias && alias.value;

  const rename = outputName == null ? undefined : `${select}:${outputName}`;

  return { select, rename };
};

const parseFragmentSpread = function ({
  parentPath,
  variables,
  fragments,
  fieldName,
}) {
  const fragment = fragments.find(({ name }) => name.value === fieldName);

  if (fragment === undefined) {
    const message = `No fragment named '${fieldName}'`;
    throwError(message, { reason: 'VALIDATION' });
  }

  const { selectionSet } = fragment;

  return parseSelectionSet({ selectionSet, parentPath, variables, fragments });
};

const parseInlineFragment = function ({
  selectionSet,
  parentPath,
  variables,
  fragments,
}) {
  return parseSelectionSet({ selectionSet, parentPath, variables, fragments });
};

const parsers = {
  Field: parseField,
  FragmentSpread: parseFragmentSpread,
  InlineFragment: parseInlineFragment,
};

module.exports = {
  parseSelects,
};
