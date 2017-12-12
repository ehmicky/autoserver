'use strict';

const { getShortcut } = require('../../../helpers');

// Retrieves map of collections's attributes for which a default value
// is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const userDefaultsMap = function ({ config }) {
  return getShortcut({ config, filter: 'default', mapper });
};

const mapper = attr => attr.default;

module.exports = {
  userDefaultsMap,
};
