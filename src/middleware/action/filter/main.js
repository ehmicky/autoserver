'use strict';

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');

const { parseAttributes } = require('./attr');

// Parse `args.filter` and `args.id` into AST
const parseFilter = function ({
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
  return { ...action, args: { ...args, filter } };
};

const parseFilterOrId = function ({ args: { id, filter }, model }) {
  if (id !== undefined) {
    return getIdFilter({ id });
  }

  return parseTopNode({ topNode: filter, model });
};

// `args.id`
const getIdFilter = function ({ id }) {
  return { type: 'eq', attrName: 'id', value: id };
};

const parseTopNode = function ({ topNode, model }) {
  if (topNode == null) { return; }

  // Top-level array means 'or' alternatives
  return Array.isArray(topNode)
    ? parseOrNode({ nodes: topNode, model })
    : parseAndNode({ node: topNode, model });
};

const parseOrNode = function ({ nodes, model }) {
  const value = nodes
    .map(node => parseAndNode({ node, model }))
    .filter(val => val !== undefined);
  return getLogicNode({ value, type: 'or' });
};

const parseAndNode = function ({ node, model }) {
  const value = Object.entries(node)
    .map(([attrName, attrVal]) => parseOperation({ attrName, attrVal, model }))
    .reduce(assignArray, []);
  return getLogicNode({ value, type: 'and' });
};

// 'and' and 'or' nodes
const getLogicNode = function ({ value, type }) {
  // E.g. when using an empty object or empty array
  if (value.length === 0) { return; }

  // No need for 'and|or' if there is only one filter
  if (value.length === 1) { return value[0]; }

  return { type, value };
};

const parseOperation = function ({ attrName, attrVal, model }) {
  const attr = model[attrName];

  validateAttrName({ attr, attrName });

  const value = parseAttributes({ attrVal, attrName, attr })
    .map(node => ({ ...node, attrName }));
  return value;
};

const validateAttrName = function ({ attr, attrName }) {
  if (attr !== undefined) { return; }

  const message = `In 'filter' argument, must not use unknown attribute '${attrName}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseFilter,
};
