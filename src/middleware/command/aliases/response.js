'use strict';

// Apply `alias` in responses
const applyResponseAliases = function ({ data, attrName, aliases }) {
  return data instanceof Array
    ? data.map(datum => applyResponseAlias({ data: datum, attrName, aliases }))
    : applyResponseAlias({ data, attrName, aliases });
};

// Copy main attribute's value to each alias, providing main attribute is
// defined
const applyResponseAlias = function ({ data, attrName, aliases }) {
  const shouldSetAliases = Object.keys(data).includes(attrName);
  if (!shouldSetAliases) { return data; }

  const aliasesObj = aliases.map(alias => ({ [alias]: data[attrName] }));

  const newData = Object.assign({}, data, ...aliasesObj);
  return newData;
};

module.exports = {
  applyResponseAliases,
};
