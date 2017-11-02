'use strict';

const { mapValues } = require('../../../utilities');
const { getModel } = require('../get_model');

const { validateData, isModelType } = require('./validate');
const { addDefaultIds } = require('./default_id');
const { isModel } = require('./nested');

// Validates `args.data` and adds default ids.
const parseData = function ({ data, ...rest }) {
  const model = getModel(rest);

  if (!Array.isArray(data)) {
    return parseDatum({ datum: data, model, ...rest });
  }

  return data
    .map((datum, index) => parseDatum({ datum, index, model, ...rest }));
};

const parseDatum = function ({
  datum,
  attrName,
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
  const path = [attrName, index].filter(part => part !== undefined);
  const commandPathA = [...commandPath, ...path];

  validateData({ datum, commandPath: commandPathA, top, maxAttrValueSize });

  const datumA = addDefaultIds({
    datum,
    top,
    model,
    userDefaultsMap,
    mInput,
    dbAdapters,
  });

  return mapValues(datumA, (obj, attrNameA) => parseAttr({
    obj,
    attrName: attrNameA,
    commandPath: commandPathA,
    top,
    userDefaultsMap,
    mInput,
    maxAttrValueSize,
    dbAdapters,
    ...rest,
  }));
};

// Recursion over nested models
const parseAttr = function ({ obj, ...rest }) {
  const isNested = isModelType(obj) && isModel(rest);
  if (!isNested) { return obj; }

  return parseData({ data: obj, ...rest });
};

module.exports = {
  parseData,
};
