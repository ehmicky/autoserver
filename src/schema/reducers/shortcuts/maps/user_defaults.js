'use strict';

const { getShortcut } = require('../../../helpers');

// Retrieves map of collections's attributes for which a default value
// is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const userDefaultsMap = function ({ schema }) {
  return getShortcut({ schema, filter: 'default', mapper });
};

const mapper = attr => attr.default;

module.exports = {
  userDefaultsMap,
};
