'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');

const { applyDirectives } = require('./directive');

const parseSelects = function ({ selectionSet, parentPath = [], fragments }) {
  if (selectionSet == null) { return []; }

  return selectionSet.selections
    .filter(applyDirectives)
    .map(parseSelection.bind(null, { parentPath, fragments }))
    .reduce(assignArray, []);
};

const parseSelection = function (
  {
    parentPath,
    fragments,
  },
  {
    name: { value: fieldName } = {},
    alias,
    selectionSet,
    kind,
  },
) {
  return parsers[kind]({
    fieldName,
    alias,
    selectionSet,
    parentPath,
    fragments,
  });
};

const parseField = function ({
  fieldName,
  alias,
  selectionSet,
  parentPath,
  fragments,
}) {
  const select = getSelect({ parentPath, alias, fieldName });

  const childSelect = parseSelects({
    selectionSet,
    parentPath: [...parentPath, fieldName],
    fragments,
  });

  return [select, ...childSelect];
};

const getSelect = function ({ parentPath, alias, fieldName }) {
  const key = [...parentPath, fieldName].join('.');
  const aliasName = alias && alias.value;

  return aliasName == null
    ? { key }
    : { key, alias: aliasName };
};

const parseFragmentSpread = function ({ parentPath, fragments, fieldName }) {
  const fragment = fragments.find(({ name }) => name.value === fieldName);

  if (fragment === undefined) {
    const message = `No fragment named ${fieldName}`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  const { selectionSet } = fragment;

  return parseSelects({ selectionSet, parentPath, fragments });
};

const parseInlineFragment = function ({ selectionSet, parentPath, fragments }) {
  return parseSelects({ selectionSet, parentPath, fragments });
};

const parsers = {
  Field: parseField,
  FragmentSpread: parseFragmentSpread,
  InlineFragment: parseInlineFragment,
};

module.exports = {
  parseSelects,
};
