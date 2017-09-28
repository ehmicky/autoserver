'use strict';

const { resolveRead } = require('./read');
const { resolveWrite } = require('./write');

const resolveActions = function ({ actionsGroupType, ...rest }) {
  const resolver = resolvers[actionsGroupType];
  return resolver({ ...rest });
};

const resolvers = {
  read: resolveRead,
  write: resolveWrite,
};

module.exports = {
  resolveActions,
};
