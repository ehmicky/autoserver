'use strict';

const { isJsl, runJsl } = require('../../../../jsl');

const readCommand = {
  commandType: 'read',
};

const updateCommand = function (
  { args: { data: dataArg }, jsl, idl },
  { data: currentData },
) {
  const newData = getNewData({ dataArg, currentData, jsl, idl });

  return {
    commandType: 'update',
    args: {
      currentData,
      newData,
    },
  };
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getNewData = function ({ dataArg, currentData, jsl, idl }) {
  // Keys in args.* using JSL
  const jslKeys = Object.keys(dataArg)
    .filter(key => isJsl({ jsl: dataArg[key] }));

  if (Array.isArray(currentData)) {
    return currentData.map(currentDatum =>
      getNewDatum({ currentDatum, dataArg, jsl, jslKeys, idl })
    );
  }

  return getNewDatum({ currentDatum: currentData, dataArg, jsl, jslKeys, idl });
};

const getNewDatum = function ({ currentDatum, dataArg, jsl, jslKeys, idl }) {
  const newAttrs = getAttrsAfterJsl({
    currentDatum,
    dataArg,
    jsl,
    jslKeys,
    idl,
  });
  return Object.assign({}, currentDatum, dataArg, ...newAttrs);
};

// Apply args.data JSL
const getAttrsAfterJsl = function ({
  currentDatum,
  dataArg,
  jsl,
  jslKeys,
  idl,
}) {
  return jslKeys.map(attrName => {
    const newAttr = getAttrAfterJsl({
      currentDatum,
      dataArg,
      attrName,
      jsl,
      idl,
    });
    return { [attrName]: newAttr };
  });
};

const getAttrAfterJsl = function ({
  currentDatum,
  dataArg,
  attrName,
  jsl,
  idl,
}) {
  // If current attribute value is null|undefined, leave it as is
  // This simplifies JSL, as $ is guaranteed to be defined
  if (currentDatum[attrName] == null) { return null; }

  const params = { $$: currentDatum, $: currentDatum[attrName] };
  return runJsl({ jsl, value: dataArg[attrName], params, type: 'data', idl });
};

/**
 * "update" action is split into two commands:
 *   - first a "read" command retrieving current models
 *     Pagination is disabled for that query.
 *   - then a "update" command using a merge `newData` of the update data
 *     `args.data` and the current models `currentData`
 * The reasons why we split "update" action are:
 *   - we need to know the current models so we can:
 *      - apply JSL present in `args.data`
 *   - we need to know all the attributes of the current model so we can:
 *      - use `$$` in the JSL used in the next middlewares, including
 *        defaults and transforms
 *      - perform cross-attributes validation.
 *        E.g. if attribute `a` must be equal to attribute `b`, when we update
 *        `a`, we need to fetch `b` to check that validation rule.
 **/
const updateAction = [
  { input: readCommand },
  { input: updateCommand },
];

module.exports = {
  update: updateAction,
};
