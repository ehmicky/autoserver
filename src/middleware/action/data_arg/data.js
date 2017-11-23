'use strict';

const { mapValues } = require('../../../utilities');
const { getColl } = require('../get_coll');

const { validateData, isModelsType } = require('./validate');
const { addDefaultIds } = require('./default_id');
const { isModel } = require('./nested');

// Validates `args.data` and adds default ids.
const parseData = function ({ data, ...rest }) {
  const coll = getColl(rest);

  if (!Array.isArray(data)) {
    return parseDatum({ datum: data, coll, ...rest });
  }

  return data
    .map((datum, index) => parseDatum({ datum, index, coll, ...rest }));
};

const parseDatum = function ({
  datum,
  attrName,
  index,
  commandpath,
  top,
  coll,
  userDefaultsMap,
  mInput,
  maxAttrValueSize,
  dbAdapters,
  ...rest
}) {
  const path = [attrName, index].filter(part => part !== undefined);
  const commandpathA = [...commandpath, ...path];

  validateData({ datum, commandpath: commandpathA, top, maxAttrValueSize });

  const datumA = addDefaultIds({
    datum,
    top,
    coll,
    userDefaultsMap,
    mInput,
    dbAdapters,
  });

  return mapValues(datumA, (obj, attrNameA) => parseAttr({
    obj,
    attrName: attrNameA,
    commandpath: commandpathA,
    top,
    userDefaultsMap,
    mInput,
    maxAttrValueSize,
    dbAdapters,
    ...rest,
  }));
};

// Recursion over nested collections
const parseAttr = function ({ obj, ...rest }) {
  const isNested = isModelsType(obj) && isModel(rest);
  if (!isNested) { return obj; }

  return parseData({ data: obj, ...rest });
};

module.exports = {
  parseData,
};
