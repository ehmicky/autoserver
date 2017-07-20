'use strict';

const { omit } = require('../../../../utilities');
const { isJsl } = require('../../../../jsl');

// Retrieves the input for the "update" command
const getUpdateInput = function ({
  input: { args, args: { data: dataArg }, action, jsl },
  data: currentData,
}) {
  const pagination = action.multiple;
  // `args.filter` is only used by first "read" command
  const newArgs = omit(args, ['filter', 'data']);
  // Keys in args.* using JSL
  const jslKeys = Object.keys(dataArg)
    .filter(key => isJsl({ jsl: dataArg[key] }));
  const newData = getNewData({ dataArg, currentData, jsl, jslKeys });
  Object.assign(newArgs, { pagination, currentData, newData });
  return { command: 'update', args: newArgs };
};

const getNewData = function ({ dataArg, currentData, jsl, jslKeys }) {
  if (Array.isArray(currentData)) {
    return currentData.map(currentDatum =>
      getNewDatum({ currentDatum, dataArg, jsl, jslKeys })
    );
  }

  return getNewDatum({ currentDatum: currentData, dataArg, jsl, jslKeys });
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getNewDatum = function ({ currentDatum, dataArg, jsl, jslKeys }) {
  const newAttrs = getAttrsAfterJsl({ currentDatum, dataArg, jsl, jslKeys });
  return Object.assign({}, currentDatum, dataArg, ...newAttrs);
};

// Apply args.data JSL
const getAttrsAfterJsl = function ({ currentDatum, dataArg, jsl, jslKeys }) {
  return jslKeys.map(attrName => {
    const newAttr = getAttrAfterJsl({ currentDatum, dataArg, attrName, jsl });
    return { [attrName]: newAttr };
  });
};

const getAttrAfterJsl = function ({ currentDatum, dataArg, attrName, jsl }) {
  // If current attribute value is null|undefined, leave it as is
  // This simplifies JSL, as $ is guaranteed to be defined
  if (currentDatum[attrName] == null) { return null; }

  const params = { $$: currentDatum, $: currentDatum[attrName] };
  return jsl.run({ value: dataArg[attrName], params, type: 'data' });
};

module.exports = {
  getUpdateInput,
};
