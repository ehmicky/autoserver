'use strict';


const { omit, isEqual } = require('lodash');


// Apply `alias` in `args.data`
const applyDataAliases = function ({ data, currentData, attrName, aliases }) {
  return data instanceof Array
    ? data.map(datum => applyDataAliases({
      data: datum,
      currentData,
      attrName,
      aliases,
    }))
    : applyDataAlias({ data, currentData, attrName, aliases });
};

// Copy first defined alias to main attribute,
// providing main attribute is "not defined".
// If the main attribute has the same value as the current value in the
// database, it is considered "not defined", because setting that value would
// induce no changes.
const applyDataAlias = function ({ data, currentData, attrName, aliases }) {
  const dataKeys = Object.keys(data);
  const shouldSetAliases = !dataKeys.includes(attrName) ||
    (currentData && isEqual(data[attrName], currentData[attrName]));

  if (shouldSetAliases) {
    const aliasName = aliases.find(alias => dataKeys.includes(alias));
    if (aliasName) {
      data[attrName] = data[aliasName];
    }
  }

  data = omit(data, aliases);

  return data;
};


module.exports = {
  applyDataAliases,
};
