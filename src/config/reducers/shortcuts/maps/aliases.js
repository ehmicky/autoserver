'use strict';

const { getShortcut } = require('../../../helpers');

// Gets a map of collections' attributes' aliases
// e.g. { collname: { attrName: ['alias', ...], ... }, ... }
const aliasesMap = function ({ config }) {
  return getShortcut({ config, filter: 'alias', mapper });
};

const mapper = ({ alias }) => (Array.isArray(alias) ? alias : [alias]);

module.exports = {
  aliasesMap,
};
