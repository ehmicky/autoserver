'use strict';

const { throwError } = require('../../../../../error');

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
    .reduce(mergeChildrenReducer, { actions: [], select: [] });
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
  const outputName = (alias && alias.value) || fieldName;
  const select = [{ dbKey: fieldName, outputKey: outputName }];

  if (!selectionSet) {
    return { actions: [], select };
  }

  const actionPath = [...parentPath, fieldName];

  const argsA = parseObject({ fields: args, variables });

  const { actions: childActions, select: childSelect } = parseActions({
    selectionSet,
    parentPath: actionPath,
    fragments,
    variables,
  });

  const action = { actionPath, args: argsA, select: childSelect };
  const actions = [action, ...childActions];
  return { actions, select };
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
  return {
    actions: [...children.actions, ...child.actions],
    select: [...children.select, ...child.select],
  };
};

module.exports = {
  parseActions,
};
