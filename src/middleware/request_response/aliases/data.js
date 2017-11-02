'use strict';

const { omit, assignObject, isEqual } = require('../../../utilities');
const { throwError } = require('../../../error');

// Apply `alias` in `args.data`
const applyDataAliases = function ({
  newData,
  currentData,
  attrName,
  aliases,
}) {
  return newData.map((datum, index) => applyDataAlias({
    newData: datum,
    currentData: currentData[index],
    attrName,
    aliases,
  }));
};

// Copy first defined alias to main attribute,
// providing main attribute is "not defined".
// If the main attribute has the same value as the current value in the
// database, it is considered "not defined", because setting that value would
// induce no changes.
const applyDataAlias = function ({ newData, currentData, attrName, aliases }) {
  const aliasData = getAliasData({ newData, currentData, attrName, aliases });
  const data = omit(newData, aliases);

  const aliasDataKeys = Object.keys(aliasData);
  if (aliasDataKeys.length === 0) { return data; }

  const [firstAttrName] = aliasDataKeys;
  const newValue = newData[firstAttrName];

  validateAliases({ newValue, aliasData, firstAttrName });

  return { ...data, [attrName]: newValue };
};

// Retrieve subset of `args.data` that is either an alias on an aliased
// attribute, unless it is "not defined".
const getAliasData = function ({ newData, currentData, attrName, aliases }) {
  const newDataKeys = Object.keys(newData);
  return [attrName, ...aliases]
    .filter(name => newDataKeys.includes(name) &&
      (!currentData || !isEqual(newData[name], currentData[name])))
    .map(name => ({ [name]: newData[name] }))
    .reduce(assignObject, {});
};

// If the request specifies several aliases, all values must be equal
const validateAliases = function ({ newValue, aliasData, firstAttrName }) {
  const wrongAlias = Object.keys(aliasData)
    .find(name => !isEqual(aliasData[name], newValue));
  if (!wrongAlias) { return; }

  const message = `'data.${firstAttrName}' and 'data.${wrongAlias}' have different values ('${JSON.stringify(newValue)}' and '${JSON.stringify(aliasData[wrongAlias])}') but must have identical values because they are aliases.`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  applyDataAliases,
};
