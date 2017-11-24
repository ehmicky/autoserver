'use strict';

const { mapValues } = require('../../../utilities');
const { preValidate } = require('../../../patch');
const { getColl } = require('../get_coll');

const { validateData, isModelsType } = require('./validate');
const { addDefaultIds } = require('./default_id');
const { isModel } = require('./nested');

// Validates `args.data` and adds default ids.
const parseData = function ({ data, schema, ...rest }) {
  const { collname } = getColl(rest);

  if (!Array.isArray(data)) {
    return parseDatum({ datum: data, collname, schema, ...rest });
  }

  return data.map((datum, index) =>
    parseDatum({ datum, index, collname, schema, ...rest }));
};

const parseDatum = function ({
  datum,
  attrName,
  index,
  commandpath,
  top,
  collname,
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
    collname,
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
    collname,
    ...rest,
  }));
};

// Recursion over nested collections
const parseAttr = function ({
  obj,
  commandpath,
  attrName,
  top,
  maxAttrValueSize,
  collsMap,
  schema,
  collname,
  ...rest
}) {
  const coll = schema.collections[collname];
  preValidate({
    patchOp: obj,
    commandpath,
    attrName,
    top,
    maxAttrValueSize,
    coll,
  });

  const isNested = isModelsType(obj) &&
    isModel({ attrName, commandpath, top, collsMap });
  if (!isNested) { return obj; }

  return parseData({
    data: obj,
    commandpath,
    attrName,
    top,
    maxAttrValueSize,
    collsMap,
    schema,
    ...rest,
  });
};

module.exports = {
  parseData,
};
