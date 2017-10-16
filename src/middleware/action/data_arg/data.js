'use strict';

const { mapValues } = require('../../../utilities');
const { getModel } = require('../get_model');

const { validateData, isModelType } = require('./validate');
const { addDefaultIds } = require('./default_id');
const { isModel } = require('./nested');

// Validates `args.data` and adds default ids.
const parseData = function ({ data, ...rest }) {
  const model = getModel(rest);

  return Array.isArray(data)
    ? data.map((datum, index) => parseDatum({ datum, index, model, ...rest }))
    : parseDatum({ datum: data, model, ...rest });
};

const parseDatum = function ({
  datum,
  index,
  commandPath,
  top,
  model,
  userDefaultsMap,
  mInput,
  maxAttrValueSize,
  dbAdapters,
  ...rest
}) {
  const commandPathA = index === undefined
    ? commandPath
    : [...commandPath, index];

  validateData({ datum, commandPath: commandPathA, top, maxAttrValueSize });

  const datumA = addDefaultIds({
    datum,
    top,
    model,
    userDefaultsMap,
    mInput,
    dbAdapters,
  });

  return mapValues(
    datumA,
    (obj, attrName) => parseAttr({
      obj,
      index,
      attrName,
      commandPath: commandPathA,
      top,
      userDefaultsMap,
      mInput,
      maxAttrValueSize,
      dbAdapters,
      ...rest,
    }),
  );
};

// Recursion over nested models
const parseAttr = function ({
  obj,
  index,
  attrName,
  commandPath,
  top,
  modelsMap,
  ...rest
}) {
  const isNested = isModelType(obj) &&
    isModel({ attrName, commandPath, top, modelsMap });
  if (!isNested) { return obj; }

  const commandPathA = index === undefined
    ? [...commandPath, attrName]
    : [...commandPath, index, attrName];
  return parseData({
    data: obj,
    commandPath: commandPathA,
    top,
    modelsMap,
    ...rest,
  });
};

module.exports = {
  parseData,
};
