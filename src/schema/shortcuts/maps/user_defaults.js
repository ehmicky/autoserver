'use strict';

const mapAttr = attr => attr.default;

// Retrieves map of collections's attributes for which a default value
// is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const userDefaultsMap = { filter: 'default', mapAttr };

module.exports = {
  userDefaultsMap,
};
