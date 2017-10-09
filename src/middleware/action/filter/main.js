'use strict';

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');

const { parseAttributes } = require('./attr');

// Parse `args.filter` into AST
const parseFilter = function ({
  actions,
  schema: { shortcuts: { modelsMap } },
}) {
  return actions.map(action => parseFilterArg({ action, modelsMap }));
};

const parseFilterArg = function ({
  action,
  action: { args, args: { filter }, modelName },
  modelsMap,
}) {
  const model = modelsMap[modelName];
  const filterA = parseTopNode({ topNode: filter, model });
  return { ...action, args: { ...args, filter } };
};

const parseTopNode = function ({ topNode, model }) {
  if (topNode == null) { return; }

  // Top-level array means 'or' alternatives
  if (Array.isArray(topNode)) {
    const value = topNode.map(node => parseNode({ node, model }));
    return { type: 'or', value };
  }

  return parseNode({ node: topNode, model });
};

const parseNode = function ({ node, model }) {
  const value = Object.entries(node)
    .map(([attrName, attrVal]) => parseOperation({ attrName, attrVal, model }))
    .reduce(assignArray, []);
  // Using several fields in an object means 'and'
  return { type: 'and', value };
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
