'use strict';

const { capitalize } = require('underscore.string');

const TOP_DESCRIPTIONS = {
  query: 'Fetch models',
  mutation: 'Modify models',
};

// Top-level action descriptions
const getCommandDescription = function ({
  command: { multiple, title },
  typeName,
}) {
  const description = multiple
    ? `${title} ${typeName} models`
    : `${title} a ${typeName} model`;
  const descriptionA = capitalize(description);
  return descriptionA;
};

// Retrieve the description of a `args.data|filter` type, and of
// `args.data|filter|id` arguments
const getArgTypeDescription = function (
  { command: { multiple, title } },
  type,
) {
  const argTypeDescription = ARG_TYPES_DESCRIPTIONS[type];
  const modelStr = multiple ? 'models' : 'model';
  const description = `${argTypeDescription} ${modelStr} to ${title}`;
  return description;
};

const ARG_TYPES_DESCRIPTIONS = {
  data: '\'data\' argument with the new',
  filter: '\'filter\' argument specifying which',
  argId: 'Specifies which',
  argFilter: 'Specifies which',
  argData: 'New',
};

module.exports = {
  TOP_DESCRIPTIONS,
  getCommandDescription,
  getArgTypeDescription,
};
