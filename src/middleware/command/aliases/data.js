'use strict';


const { omit, isEqual } = require('lodash');


// Apply `alias` in `args.data`
const applyDataAliases = function ({
  newData,
  currentData,
  attrName,
  aliases,
}) {
  return newData instanceof Array
    ? newData.map(datum => applyDataAliases({
      newData: datum,
      currentData,
      attrName,
      aliases,
    }))
    : applyDataAlias({ newData, currentData, attrName, aliases });
};

// Copy first defined alias to main attribute,
// providing main attribute is "not defined".
// If the main attribute has the same value as the current value in the
// database, it is considered "not defined", because setting that value would
// induce no changes.
const applyDataAlias = function ({ newData, currentData, attrName, aliases }) {
  const newDataKeys = Object.keys(newData);
  const shouldSetAliases = !newDataKeys.includes(attrName) ||
    (currentData && isEqual(newData[attrName], currentData[attrName]));

  if (shouldSetAliases) {
    const aliasName = aliases.find(alias => newDataKeys.includes(alias));
    if (aliasName) {
      newData[attrName] = newData[aliasName];
    }
  }

  newData = omit(newData, aliases);

  return newData;
};


module.exports = {
  applyDataAliases,
};
