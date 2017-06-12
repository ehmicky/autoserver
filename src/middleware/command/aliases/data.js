'use strict';


const { omit, isEqual } = require('lodash');


// Apply `alias` in `args.data`
const applyDataAliases = function ({ data, current, attrName, aliases }) {
  return data instanceof Array
    ? data.map(data => applyDataAliases({ data, current, attrName, aliases }))
    : applyDataAlias({ data, current, attrName, aliases });
};

// Copy first defined alias to main attribute,
// providing main attribute is "not defined".
// If the main attribute has the same value as the current value in the
// database, it is considered "not defined", because setting that value would
// induce no changes.
const applyDataAlias = function ({ data, current, attrName, aliases }) {
  const dataKeys = Object.keys(data);
  const shouldSetAliases = !dataKeys.includes(attrName) ||
    (current && isEqual(data[attrName], current[attrName]));

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
