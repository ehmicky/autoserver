'use strict';

const { getArgTypeDescription } = require('../../../../description');

// `filter` argument
const getFilterArgument = function (def, { filterObjectType }) {
  const hasFilter = FILTER_COMMAND_TYPES.includes(def.command);
  if (!hasFilter) { return {}; }

  const description = getArgTypeDescription(def, 'argFilter');

  return { filter: { type: filterObjectType, description } };
};

const FILTER_COMMAND_TYPES = ['find', 'delete', 'patch'];

module.exports = {
  getFilterArgument,
};
