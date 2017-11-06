'use strict';

const { omit } = require('../../utilities');
const { parseFilter, validateFilter } = require('../../filter');

// Parse `args.filter` and `args.id` into AST
const parseFilterActions = function ({ actions, schema }) {
  const actionsA = actions.map(action => parseFilterArg({ action, schema }));
  return { actions: actionsA };
};

const parseFilterArg = function ({
  action,
  action: { args, modelName },
  schema: { shortcuts: { modelsMap } },
}) {
  const model = modelsMap[modelName];
  const filter = parseFilterOrId({ args, model });

  if (filter === undefined) { return action; }

  const argsA = omit(args, 'id');
  return { ...action, args: { ...argsA, filter } };
};

const parseFilterOrId = function ({ args: { id, filter }, model }) {
  if (id !== undefined) {
    return getIdFilter({ id });
  }

  const prefix = 'In \'filter\' argument, ';
  const filterA = parseFilter({ filter, prefix });

  validateFilter({ filter: filterA, attrs: model, prefix });

  return filterA;
};

// `args.id`
const getIdFilter = function ({ id }) {
  return { type: '_eq', attrName: 'id', value: id };
};

module.exports = {
  parseFilter: parseFilterActions,
};
