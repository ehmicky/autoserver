'use strict';

const { parseFilter } = require('../../database');

// Parse `args.filter` and `args.id` into AST
const parseFilterActions = function ({
  actions,
  schema: { shortcuts: { modelsMap } },
}) {
  const actionsA = actions.map(action => parseFilterArg({ action, modelsMap }));
  return { actions: actionsA };
};

const parseFilterArg = function ({
  action,
  action: { args, modelName },
  modelsMap,
}) {
  const model = modelsMap[modelName];
  const filter = parseFilterOrId({ args, model });

  if (filter === undefined) { return action; }

  return { ...action, args: { ...args, filter } };
};

const parseFilterOrId = function ({ args: { id, filter }, model }) {
  if (id !== undefined) {
    return getIdFilter({ id });
  }

  const prefix = 'In \'filter\' argument, ';
  return parseFilter({ filter, attrs: model, prefix });
};

// `args.id`
const getIdFilter = function ({ id }) {
  return { type: 'eq', attrName: 'id', value: id };
};

module.exports = {
  parseFilter: parseFilterActions,
};
