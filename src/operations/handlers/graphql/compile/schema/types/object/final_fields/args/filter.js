'use strict';

const { ARG_TYPES_DESCRIPTIONS } = require('../../../../description');

// `filter` argument
const getFilterArgument = function (def, { filterObjectType }) {
  const hasFilter = def.command.multiple &&
    FILTER_COMMAND_TYPES.includes(def.command.type);
  if (!hasFilter) { return {}; }

  const description = ARG_TYPES_DESCRIPTIONS.filter[def.command.name];

  return { filter: { type: filterObjectType, description } };
};

const FILTER_COMMAND_TYPES = ['find', 'delete', 'patch'];

module.exports = {
  getFilterArgument,
};
