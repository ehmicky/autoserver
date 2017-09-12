'use strict';

const { throwError } = require('../../../../../error');
const { mapValues } = require('../../../../../utilities');

const { parseObject } = require('./args');
const { applyDirectives } = require('./directive');

const parseActions = function ({
  selectionSet: { selections },
  parentPath = [],
  variables,
  fragments,
}) {
  return selections
    .filter(applyDirectives)
    .map(parseSelection.bind(null, { parentPath, variables, fragments }))
    .reduce(mergeChildrenReducer, {});
};

const parseSelection = function (
  {
    parentPath,
    variables,
    fragments,
  },
  {
    name: { value: fieldName } = {},
    alias,
    selectionSet,
    arguments: args,
    kind,
  },
) {
  return parsers[kind]({
    fieldName,
    alias,
    selectionSet,
    args,
    parentPath,
    variables,
    fragments,
  });
};

const parseField = function ({
  fieldName,
  alias,
  selectionSet,
  args,
  parentPath,
  variables,
  fragments,
}) {
  const childPath = (alias && alias.value) || fieldName;

  if (!selectionSet) {
    return {
      actions: [],
      select: [{ outputKey: childPath, dbKey: fieldName }],
    };
  }

  const actionPath = [...parentPath, childPath];
  const fullAction = actionPath.join('.');
  const isTopLevel = actionPath.length === 1;

  const argsA = parseObject({ fields: args, variables });

  const { actions: childActions, select: childSelect } = parseActions({
    selectionSet,
    parentPath: actionPath,
    fragments,
    variables,
  });

  const action = {
    actionName: fieldName,
    actionPath,
    fullAction,
    isTopLevel,
    args: argsA,
    select: childSelect,
  };

  const actions = [action, ...childActions];
  return { actions, select: [] };
};

const parseFragmentSpread = function ({
  parentPath,
  fragments,
  variables,
  fieldName,
}) {
  const fragment = fragments.find(({ name }) => name.value === fieldName);

  if (!fragment) {
    const message = `No fragment named ${fieldName}`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  const { selectionSet } = fragment;

  return parseActions({ selectionSet, parentPath, fragments, variables });
};

const parseInlineFragment = function ({
  selectionSet,
  parentPath,
  fragments,
  variables,
}) {
  return parseActions({ selectionSet, parentPath, fragments, variables });
};

const parsers = {
  Field: parseField,
  FragmentSpread: parseFragmentSpread,
  InlineFragment: parseInlineFragment,
};

const mergeChildrenReducer = function (children, child) {
  return mapValues(
    child,
    (arr, key) => (children[key] || []).concat(arr),
  );
};

module.exports = {
  parseActions,
};
