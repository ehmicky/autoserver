'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');

const { applyDirectives } = require('./directive');

// Retrieve `operationDef.args.select` using GraphQL selection sets
const parseSelects = function (input) {
  const select = parseSelectionSet(input);
  return select.join(',');
};

const parseSelectionSet = function ({
  selectionSet,
  parentPath = [],
  variables,
  fragments,
}) {
  if (selectionSet == null) { return []; }

  return selectionSet.selections
    .filter(selection => applyDirectives({ selection, variables }))
    .map(parseSelection.bind(null, { parentPath, variables, fragments }))
    .reduce(assignArray, []);
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
  const select = getSelect({ parentPath, alias, fieldName });

  const childSelect = parseSelectionSet({
    selectionSet,
    parentPath: [...parentPath, fieldName],
    variables,
    fragments,
  });

  return [select, ...childSelect];
};

const getSelect = function ({ parentPath, alias, fieldName }) {
  const key = [...parentPath, fieldName].join('.');
  const aliasName = alias && alias.value;

  return aliasName == null ? key : `${key}=${aliasName}`;
};

const parseFragmentSpread = function ({
  parentPath,
  variables,
  fragments,
  fieldName,
}) {
  const fragment = fragments.find(({ name }) => name.value === fieldName);

  if (fragment === undefined) {
    const message = `No fragment named ${fieldName}`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
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
