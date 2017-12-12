'use strict';

const { omit } = require('../../utilities');
const { parseFilter, validateFilter } = require('../../filter');

// Parse `args.filter` and `args.id` into AST
const parseFilterActions = function ({ actions, config }) {
  const actionsA = actions.map(action => parseFilterArg({ action, config }));
  return { actions: actionsA };
};

const parseFilterArg = function ({
  action,
  action: { args, collname },
  config: { collections },
}) {
  const { attributes } = collections[collname];
  const filter = parseFilterOrId({ args, attributes });

  if (filter === undefined) { return action; }

  const argsA = omit(args, 'id');
  return { ...action, args: { ...argsA, filter } };
};

const parseFilterOrId = function ({ args: { id, filter }, attributes }) {
  if (id !== undefined) {
    return getIdFilter({ id });
  }

  const prefix = 'In \'filter\' argument, ';
  const filterA = parseFilter({ filter, prefix });

  validateFilter({ filter: filterA, attrs: attributes, prefix });

  return filterA;
};

// `args.id`
const getIdFilter = function ({ id }) {
  return { type: '_eq', attrName: 'id', value: id };
};

module.exports = {
  parseFilter: parseFilterActions,
};
