'use strict';

const mapAttr = ({ alias }) => (Array.isArray(alias) ? alias : [alias]);

// Gets a map of collections' attributes' aliases
// e.g. { collname: { attrName: ['alias', ...], ... }, ... }
const aliasesMap = { filter: 'alias', mapAttr };

module.exports = {
  aliasesMap,
};
