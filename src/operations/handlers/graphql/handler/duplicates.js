'use strict';

const { throwError } = require('../../../../error');

// GraphQL spec includes many requirements of checking for duplicates
const validateDuplicates = function ({ nodes, type }) {
  nodes
    .forEach((node, index) => validateDuplicate({ node, nodes, index, type }));
};

const validateDuplicate = function ({ node, nodes, index, type }) {
  const nodeName = node.name && node.name.value;
  const hasDuplicate = nodes
    .map(({ name }) => name && name.value)
    .slice(index + 1)
    .includes(nodeName);

  if (hasDuplicate) {
    const message = `Two ${type} are named '${nodeName}'`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

module.exports = {
  validateDuplicates,
};
